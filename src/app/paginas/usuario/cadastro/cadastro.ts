import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro.html'
})
export class Cadastro {
  private autenticacao = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  nome = '';
  email = '';
  senha = '';
  confirmacaoSenha = '';
  carregando = false;
  erro = '';
  emailInvalido = false;

  validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  registrar() {
    this.carregando = true;
    this.erro = '';
    this.emailInvalido = false;

    if (!this.validarEmail(this.email)) {
      this.erro = 'Por favor, insira um email válido.';
      this.emailInvalido = true;
      this.carregando = false;
      return;
    }

    if (this.validarSenha(this.senha, this.confirmacaoSenha)) {
      this.autenticacao.registrar({ nome: this.nome, email: this.email, senha: this.senha, perfil: 'CLIENTE' }).subscribe({
        next: (res: any) => {
          const token = res?.tokens.tokenAcesso;
          const usuario = res?.usuario;
          if (token) {
            this.autenticacao.salvarToken(token, usuario);
            this.router.navigateByUrl('/catalogo');
          }
          this.carregando = false;
        },
        error: (err) => {
          this.erro = err?.error?.message || 'Ocorreu uma falha ao cadastrar.';
          this.carregando = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.carregando = false;
    }
  }

  validarSenha(senha: string, confirmacao: string) {
    if (senha !== confirmacao) {
      this.erro = 'As senhas não coincidem.';
      return false;
    } else {
      return true;
    }
  }
}
