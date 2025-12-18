import { effect, inject, Injectable, signal } from "@angular/core";
import { AuthService } from "../../core/auth.service";
import { ApiService } from "../../core/api.service";
import { forkJoin } from "rxjs";


export interface ItemCarrinho {
    id: number;
    nomeProduto: string;
    precoProduto: number;
    imagemProduto?: string;
    quantidade: number;
    estoqueProduto: number;
}

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
    private autenticacao = inject(AuthService);
    private api = inject(ApiService);
    estoqueDisponivel!: number;
    private itens = signal<ItemCarrinho[]>([]);
    private mensagemAlerta = signal<{ tipo: 'success' | 'danger' | 'warning' | null; mensagem: string }>({ tipo: null, mensagem: '' });
    alerta = this.mensagemAlerta.asReadonly();
    itensCarrinho = this.itens.asReadonly();

    get total() {
        return () => this.calcularTotal();
    }
    
    get carrinhoValido() {
        return () => {
            const itens = this.itens();
            return itens.every(item => item.quantidade <= item.estoqueProduto);
        };
    }

    get produtosComEstoqueInsuficiente() {
        return () => {
            const itens = this.itens();
            return itens
                .filter(item => item.quantidade > item.estoqueProduto)
                .map(item => item.nomeProduto);
        };
    }

    constructor() {
        effect(() => {
            const usuario = this.autenticacao.usuario();
            this.carregarCarrinhoUsuario();
        });

        effect(() => {
            const itensAtuais = this.itens();
            if (this.autenticacao.usuario()){
                this.salvarACarrinhoUsuario();
            }
        });
    }

    private getStorageKey(): string {
        const usuario = this.autenticacao.usuario();
        return usuario ? `carrinho_itens_usuario_${usuario.id}` : 'carrinho_itens_anonimo';
    }

    private carregarCarrinhoUsuario() {
        const key = this.getStorageKey();
        const dados = localStorage.getItem(key);
        const itensCarregados: ItemCarrinho[] = dados ? JSON.parse(dados) : [];

        if (itensCarregados.length > 0) {
            itensCarregados.forEach(item => {
                this.api.obterProduto(item.id.toString()).subscribe({
                    next: (produto: any) => {
                        this.atualizarEstoqueItem(item.id, produto.estoqueProduto);
                    },
                    error: () => {
                        console.warn(`Não foi possível obter o produto com ID ${item.id} para atualizar o estoque.`);
                    }
                });
            });        
        }

        this.itens.set(itensCarregados);
    }

    private atualizarEstoqueItem(id: number, novoEstoque: number) {
        this.itens.set(
            this.itens().map(item =>
                item.id === id ? { ...item, estoqueProduto: novoEstoque } : item
            )
        );
    }

    private salvarACarrinhoUsuario() {
        const key = this.getStorageKey();
        localStorage.setItem(key, JSON.stringify(this.itens()));
    }

    adicionarItem(produto: any) {
        // Verificar se o produto está esgotado
        if (!produto.estoqueProduto || produto.estoqueProduto === 0) {
            this.mostrarAlerta('danger', 'Este produto está esgotado.');
            return;
        }

        const itensAtuais = this.itens();
        const itemExistente = itensAtuais.find(item => item.id === produto.id);
        if (itemExistente) {
            const novaQuantidade = itemExistente.quantidade + 1;
            if (novaQuantidade > produto.estoqueProduto) {
                this.mostrarAlerta('danger', 'Quantidade solicitada excede o estoque disponível.');
                return;
            }

            this.itens.set(
                itensAtuais.map(item =>
                    item.id === produto.id ? { ...item, quantidade: novaQuantidade } : item
                )
            );
        } else {
            this.itens.set([
                ...itensAtuais,
                {
                    id: produto.id,
                    nomeProduto: produto.nomeProduto,
                    precoProduto: produto.precoProduto,
                    imagemProduto: produto.imagemProduto,
                    quantidade: 1,
                    estoqueProduto: produto.estoqueProduto
                }
            ]);
        }
    }

    removerItem(id: number) {
        this.itens.set(this.itens().filter(item => item.id !== id));
    }

    limparCarrinho() {
        this.itens.set([]);
        const key = this.getStorageKey();
        localStorage.removeItem(key);
    }

    alterarQuantidade(id: number, quantidade: number) {
        if (quantidade <= 0) {
            this.removerItem(id);
            return;
        }

        const item = this.itens().find(i => i.id === id);
        if (item) {
            if (quantidade > item.quantidade && quantidade > item.estoqueProduto) {
                this.mostrarAlerta('danger', 'Quantidade solicitada excede o estoque disponível.');
                return;
            }

            if (quantidade > item.estoqueProduto && quantidade < item.quantidade) {
                this.mostrarAlerta('warning', 'Quantidade solicitada excede o estoque disponível.');
            } else if (quantidade <= item.estoqueProduto) {
                this.limparAlerta();
            }

        }

        this.itens.set(
            this.itens().map(item =>
                item.id === id ? { ...item, quantidade } : item
            )
        );
    }

    mostrarAlerta(tipo: 'success' | 'danger' | 'warning' | null, mensagem: string) {
        this.mensagemAlerta.set({ tipo, mensagem });
        setTimeout(() => this.limparAlerta(), 3000);
    }

    limparAlerta() {
        this.mensagemAlerta.set({ tipo: null, mensagem: '' });
    }

    calcularTotal(): number {
        return this.itens().reduce((total, item) => total + (item.precoProduto * item.quantidade), 0);
    }

    atualizarEstoqueTodosProdutos() {
        const itensAtuais = this.itens();
        if (itensAtuais.length === 0) return;

        const requests = itensAtuais.map(item => 
            this.api.obterProduto(item.id.toString())
        );

        forkJoin(requests).subscribe({
            next: (produtos: any[]) => {
                const itensAtualizados = itensAtuais.map((item, index) => ({
                    ...item,
                    estoqueProduto: produtos[index].estoqueProduto
                }));
                this.itens.set(itensAtualizados);
            },
            error: (erro) => {
                console.error('Erro ao atualizar estoques:', erro);
            }
        });
    }
}