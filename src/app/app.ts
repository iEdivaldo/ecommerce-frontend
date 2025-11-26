import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, Output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './core/auth.service';
import { BotaoLogoutComponent } from "./shared/logout/logout";

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, BotaoLogoutComponent],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = 'ecommerce-frontend';
  private autenticacao = inject(AuthService);
  usuarioAtual = this.autenticacao.usuario;
  
  menuColapsado = false;
 
  isAdmin = computed(() => this.usuarioAtual().perfil === 'ADMINISTRADOR');
  logout() {
    this.autenticacao.logout();
  }
}
