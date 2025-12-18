import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { ApiService } from "../../core/api.service";
import { CarrinhoService } from "../carrinho/carrinho.service";

@Component({
  selector: 'pagina-checkout',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html'
})
export class PaginaCheckoutComponent {
    private apiService = inject(ApiService);
    private carrinhoService = inject(CarrinhoService);
    private router = inject(Router);

    etapaAtual = signal(1);
    endereco = signal<any[]>([]);
    enderecoSelecionado = signal<any>(null);
    metodoPagamento = signal<string>('');
    processandoPedido = signal<boolean>(false);

    novoEndereco = {
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
    };

    itensCarrinho = this.carrinhoService.itensCarrinho;
    total = this.carrinhoService.total;
    frete = signal(5.00);
    totalComFrete = signal(0);

    ngOnInit() {
        if (this.itensCarrinho().length === 0) {
            this.router.navigate(['/carrinho']);
            return;
        }
        this.calcularTotalComFrete();
        this.carregarEnderecos();
    }

    calcularTotalComFrete() {
        this.totalComFrete.set(this.total() + this.frete());
    }

    carregarEnderecos() {
        this.apiService.listarEnderecos().subscribe({
            next: (dados) => {
                this.endereco.set(dados);
                if (dados.length > 0) {
                    this.enderecoSelecionado.set(dados[0]);
                }
            },
            error: (erro) => {
                console.error('Erro ao carregar endereços:', erro);
            }
        });
    }

    selecionarEndereco(endereco: any) {
        this.enderecoSelecionado.set(endereco);
    }

    adicionarEndereco() {
        this.apiService.criarEndereco(this.novoEndereco).subscribe({
            next: (enderecoCriado) => {
                this.endereco.update(enderecos => [...enderecos, enderecoCriado]);
                this.enderecoSelecionado.set(enderecoCriado);
                this.novoEndereco = {
                    logradouro: '',
                    numero: '',
                    complemento: '',
                    bairro: '',
                    cidade: '',
                    estado: '',
                    cep: ''
                };
            },
            error: (erro) => {
                console.error('Erro ao adicionar endereço:', erro);
            }
        });
    }

    proximaEtapa() {
        if (this.etapaAtual() === 1 && !this.enderecoSelecionado()) {
            alert('Por favor, selecione um endereço de entrega.');
            return;
        }

        if (this.etapaAtual() === 2 && !this.metodoPagamento()) {
            alert('Por favor, selecione um método de pagamento.');
            return;
        }

        if (this.etapaAtual() < 3) {
            this.etapaAtual.update(etapa => etapa + 1);
        }
    }

    voltarEtapa() {
        if (this.etapaAtual() > 1) {
            this.etapaAtual.update(etapa => etapa - 1);
        }
    }

    finalizarPedido() {
        if (!this.enderecoSelecionado() || !this.metodoPagamento()) {
            alert('Por favor, complete todas as etapas antes de finalizar o pedido.');
            return;
        }
        this.processandoPedido.set(true);

        const pedidoDTO = {
            enderecoId: this.enderecoSelecionado().id,
            metodoPagamento: this.metodoPagamento(),
            itens: this.itensCarrinho().map(item => ({
                produtoId: item.id,
                quantidade: item.quantidade
            }))
        };

        this.apiService.criarPedido(pedidoDTO).subscribe({
            next: (resp) => {
                alert('Pedido realizado com sucesso!');
                this.carrinhoService.limparCarrinho();
                this.router.navigate(['/pedidos']);
            },
            error: (erro) => {
                console.error('Erro ao finalizar pedido:', erro);
                alert('Ocorreu um erro ao finalizar o pedido. Por favor, tente novamente.');
                this.processandoPedido.set(false);
            }
        });
    }

    formatarEndereco(endereco: any): string {
        return `${endereco.logradouro}, ${endereco.numero}${endereco.complemento ? ', ' + endereco.complemento : ''}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}, CEP: ${endereco.cep}`;
    }
}