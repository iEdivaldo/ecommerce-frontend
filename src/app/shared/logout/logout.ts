import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../core/auth.service";

@Component({
  selector: 'botao-logout',
  imports: [CommonModule, RouterModule],
  template: `<button *ngIf="usuarioAtual()" (click)="logout()" class="btn btn-danger text-start mb-2 w-100">Sair</button>`
})
export class BotaoLogoutComponent {
  private autenticacao = inject(AuthService);

  usuarioAtual = this.autenticacao.usuario;

  @Input()
  usuarioAtualBoolean: boolean = true

  logout() {
    this.autenticacao.logout();
  }
}
