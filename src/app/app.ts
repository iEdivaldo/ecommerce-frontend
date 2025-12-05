import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Input, Output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './core/auth.service';
import { BotaoLogoutComponent } from "./shared/logout/logout";
import { TemaService } from './shared/tema/tema.service';
import { ApiService } from './core/api.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, BotaoLogoutComponent],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = 'ecommerce-frontend';
  private autenticacao = inject(AuthService);
  usuarioAtual = this.autenticacao.usuario;
  protected tema = inject(TemaService);
  menuColapsado = false;
  private apiService = inject(ApiService);
  contadorNotificacoes = signal(0);
  private intervaloNotificacoes?: number;

  isAdmin = computed(() => this.usuarioAtual().perfil === 'ADMINISTRADOR');
  isSuperAdmin = computed(() => this.usuarioAtual().perfil === 'SUPER_ADMIN');

  constructor() {
    effect(() => {
      const usuario = this.usuarioAtual();
      if (usuario && usuario.id) {
        this.carregarContadorNotificacoes();
        
        // Limpa intervalo anterior se existir
        if (this.intervaloNotificacoes) {
          clearInterval(this.intervaloNotificacoes);
        }
        
        // Atualiza a cada 30 segundos
        this.intervaloNotificacoes = window.setInterval(() => {
          this.carregarContadorNotificacoes();
        }, 5000);
      } else {
        // Limpa intervalo quando deslogar
        if (this.intervaloNotificacoes) {
          clearInterval(this.intervaloNotificacoes);
          this.intervaloNotificacoes = undefined;
        }
        this.contadorNotificacoes.set(0);
      }
    });
  }

  logout() {
    this.autenticacao.logout();
  }

  carregarContadorNotificacoes() {
    this.apiService.contarNotificacoesNaoLidas().subscribe({
      next: (count) => {
        this.contadorNotificacoes.set(count);
      },
      error: (erro) => {
        console.error('Erro ao carregar contador de notificações:', erro);
      }
    });
  }

  alterarTema() {
    this.tema.alternarTema();
  }
}
