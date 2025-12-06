import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../../core/api.service";

@Component({
  selector: 'pagina-vendas',
  imports: [CommonModule, FormsModule],
  templateUrl: './vendas.html'
})
export class VendasPagina {
    private apiService = inject(ApiService);
    
    pedidos = signal<any[]>([]);
    carregando = signal(true);
    pedidoSelecionado = signal<any>(null);
    novoStatus = signal<string>('');
    pedidosExpandidos = signal<Set<number>>(new Set()); // ✅ NOVO

    statusDisponiveis = [
        { valor: 'PAGO', texto: 'Pagamento confirmado' },
        { valor: 'ENVIADO', texto: 'Enviado' },
        { valor: 'ENTREGUE', texto: 'Entregue' },
        { valor: 'CANCELADO', texto: 'Cancelado' }
    ];

    ngOnInit() {
        this.carregarVendas();
    }

    carregarVendas() {
        this.carregando.set(true);
        this.apiService.listarMinhasVendas().subscribe({
            next: (dados) => {
                this.pedidos.set(dados);
                this.carregando.set(false);
            },
            error: (erro) => {
                console.error('Erro ao carregar vendas:', erro);
                this.carregando.set(false);
            }
        });
    }

    abrirModalStatus(pedido: any) {
        this.pedidoSelecionado.set(pedido);
        this.novoStatus.set(pedido.status);
    }

    // ✅ NOVO: Método para expandir/colapsar
    togglePedido(pedidoId: number) {
        const expandidos = new Set(this.pedidosExpandidos());
        if (expandidos.has(pedidoId)) {
            expandidos.delete(pedidoId);
        } else {
            expandidos.add(pedidoId);
        }
        this.pedidosExpandidos.set(expandidos);
    }

    // ✅ NOVO: Verificar se está expandido
    pedidoExpandido(pedidoId: number): boolean {
        return this.pedidosExpandidos().has(pedidoId);
    }

    atualizarStatus() {
        const pedido = this.pedidoSelecionado();
        if (!pedido || !this.novoStatus()) {
            return;
        }

        this.apiService.atualizarStatusPedido(pedido.id, this.novoStatus()).subscribe({
            next: () => {
                this.carregarVendas();
                this.fecharModal();
            },
            error: (erro) => {
                console.error('Erro ao atualizar status do pedido:', erro);
            }
        });
    }

    fecharModal() {
        this.pedidoSelecionado.set(null);
        this.novoStatus.set('');
    }

    getStatusClass(status: string): string {
        const classes: any = {
            'CRIADO': 'bg-secondary',
            'PAGO': 'bg-success',
            'ENVIADO': 'bg-info',
            'ENTREGUE': 'bg-primary',
            'CANCELADO': 'bg-danger'
        };
        return classes[status] || 'bg-secondary';
    }

    getStatusTexto(status: string): string {
        const textos: any = {
            'CRIADO': 'Aguardando o pagamento',
            'PAGO': 'Pago',
            'ENVIADO': 'Enviado',
            'ENTREGUE': 'Entregue',
            'CANCELADO': 'Cancelado'
        };
        return textos[status] || status;
    }

    formatarData(data: string): string {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    calcularTotalVenda(pedido: any): number {
        return pedido.itens.filter((item: any) => item.produto.usuarioCriacao?.id)
        .reduce((total: number, item: any) => total + (item.precoUnitario * item.quantidade), 0);
    }
}