import { effect, inject, Injectable, signal } from "@angular/core";
import { AuthService } from "../../core/auth.service";


export interface ItemCarrinho {
    id: number;
    nomeProduto: string;
    precoProduto: number;
    imagemProduto?: string;
    quantidade: number;
}

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
    private autenticacao = inject(AuthService);

    private itens = signal<ItemCarrinho[]>([]);
    
    itensCarrinho = this.itens.asReadonly();

    get total() {
        return () => this.calcularTotal();
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
        this.itens.set(dados ? JSON.parse(dados) : []);
    }

    private salvarACarrinhoUsuario() {
        const key = this.getStorageKey();
        localStorage.setItem(key, JSON.stringify(this.itens()));
    }

    adicionarItem(produto: any) {
        const itensAtuais = this.itens();
        const itemExistente = itensAtuais.find(item => item.id === produto.id);

        if (itemExistente) {
            this.itens.set(
                itensAtuais.map(item =>
                    item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
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
                    quantidade: 1
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

        this.itens.set(
            this.itens().map(item =>
                item.id === id ? { ...item, quantidade } : item
            )
        );
    }

    calcularTotal(): number {
        return this.itens().reduce((total, item) => total + (item.precoProduto * item.quantidade), 0);
    }

}