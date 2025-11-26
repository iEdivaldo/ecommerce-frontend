import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class Login {
  
  private autenticacao = inject(AuthService);
  private router = inject(Router);

  email = '';
  senha = '';
  carregando = false;
  erro: string = '';

  form = {
    email: 'admin@exemplo.com',
    senha: 'admin'
  };

  entrar() {
    this.carregando = true;
    this.erro = '';
    this.autenticacao.entrar({ email: this.email, senha: this.senha }).subscribe({
      next: (res: any) => {
        const token = res?.tokens.tokenAcesso;
        const usuario = res?.usuario;

        if (token) {
          this.autenticacao.salvarToken(token, usuario);
          this.router.navigateByUrl('/produtos');
        }
      },
      error: (err) => {
        this.erro = err?.error?.message || 'Ocorreu uma falha ao entrar.';
      },
      complete: () => {
        this.carregando = false;
      }

    });
  }
}