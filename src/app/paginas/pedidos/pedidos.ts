import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ApiService } from "../../core/api.service";

@Component({
  selector: 'pagina-pedidos',
  imports: [CommonModule, RouterModule],
  templateUrl: './pedidos.html'
})
export class PedidosPagina {
    private apiService = inject(ApiService);

    pedidos = signal<any[]>([]);
    carregando = signal(true);

    ngOnInit() {
        this.carregarPedidos();
    }

    carregarPedidos() {
        this.carregando.set(true);
        this.apiService.listarPedidos().subscribe({
            next: (dados) => {
                this.pedidos.set(dados);
                this.carregando.set(false);
            },
            error: (erro) => {
                console.error('Erro ao carregar pedidos:', erro);
                this.carregando.set(false);
            }
        });
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
}