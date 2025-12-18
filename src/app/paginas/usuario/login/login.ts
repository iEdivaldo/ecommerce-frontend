import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  email = '';
  senha = '';
  carregando = false;
  erro: string = '';
  emailInvalido = false;

  form = {
    email: 'admin@exemplo.com',
    senha: 'admin'
  };

  validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  entrar() {
    this.carregando = true;
    this.erro = '';
    this.emailInvalido = false;

    if (!this.validarEmail(this.email)) {
      this.erro = 'Por favor, insira um email válido.';
      this.emailInvalido = true;
      this.carregando = false;
      return;
    }
    this.autenticacao.entrar({ email: this.email, senha: this.senha }).subscribe({
      next: (res: any) => {
        const token = res?.tokens.tokenAcesso;
        const usuario = res?.usuario;

        if (token) {
          this.autenticacao.salvarToken(token, usuario);
          this.router.navigateByUrl('/produtos');
        }
        this.carregando = false;
      },
      error: (err) => {
        this.erro = err?.error?.message || 'Ocorreu uma falha ao entrar.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }
}