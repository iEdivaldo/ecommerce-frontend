import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { ApiService } from "../../core/api.service";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-notificacoes',
  imports: [CommonModule, RouterModule],
  templateUrl: './notificacoes.html',
})
export class Notificacoes {
    apiService = inject(ApiService);
    notificacoes: any[] = [];
    carregando: boolean = true;
    private cdr = inject(ChangeDetectorRef);

    ngOnInit() {
        this.carregarNotificacoes();
    }

    carregarNotificacoes() {
        this.carregando = true;
        this.apiService.listarNotificacoes().subscribe({
            next: (data) => {
                this.notificacoes = data;
                this.carregando = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                this.carregando = false;
                this.notificacoes = [];
            }
        });
    }

    temNotificacoesNaoLidas(): boolean {
        return this.notificacoes && this.notificacoes.some(n => !n.lida);
    }

    marcarComoLida(notificacao: any) {
        if (!notificacao.lida) {
            this.apiService.marcarNotificacaoComoLida(notificacao.id).subscribe(() => {
                notificacao.lida = true;
            });
        }
    }

    marcarTodasComoLidas() {
        this.apiService.marcarTodasNotificacoesComoLidas().subscribe(() => {
            this.notificacoes.forEach(n => n.lida = true);
        });
    }

    formatarData(dataString: string): string {
        const data = new Date(dataString);
        const agora = new Date();
        const diffMs = agora.getTime() - data.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffDias = Math.floor(diffMs / 86400000);

        if (diffMin < 1) return 'Agora';
        if (diffMin < 60) return `${diffMin} minuto(s) atrás`;
        if (diffHrs < 24) return `${diffHrs} hora(s) atrás`;
        if (diffDias < 7) return `${diffDias} dias atrás`;

        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    getIconeNotificacao(tipo: string): string {
        switch(tipo) {
            case 'PRODUTO_EXCLUIDO': return '🗑️';
            case 'AVISO': return '⚠️';
            case 'INFORMACAO': return 'ℹ️';
            default: return '📢';
        }
    }
}