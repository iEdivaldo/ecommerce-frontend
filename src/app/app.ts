import { CommonModule } from '@angular/common';
import { Component, inject, Input, Output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './core/auth.service';
import { BotaoLogoutComponent } from "./shared/logout/logout";

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, BotaoLogoutComponent],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('ecommerce-frontend');
  private autenticacao = inject(AuthService);
  usuarioAtual = this.autenticacao.usuario;
  
  menuColapsado = false;
  admin = false;
  logout() {
    this.autenticacao.logout();
  }

  isAdmin() {
    if(this.usuarioAtual().perfil === 'ADMINISTRADOR') {
      this.admin = true;
    }
    return this.admin;
  }
}
