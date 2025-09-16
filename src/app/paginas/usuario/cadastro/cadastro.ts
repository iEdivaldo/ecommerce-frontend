import { Component, inject } from '@angular/core';
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

  nome = '';
  email = '';
  senha = '';
  confirmacaoSenha = '';
  carregando = false;
  erro = '';

  registrar() {
    this.carregando = true;
    this.erro = '';
    if (this.validarSenha(this.senha, this.confirmacaoSenha)) {
      this.autenticacao.registrar({ nome: this.nome, email: this.email, senha: this.senha, perfil: 'CLIENTE' }).subscribe({
        next: (res: any) => {
          const token = res?.tokens.tokenAcesso;
          const usuario = res?.usuario;
          if (token) {
            this.autenticacao.salvarToken(token, usuario);
            this.router.navigateByUrl('/catalogo');
          }
        },
        error: (err) => {
          this.erro = err?.error?.message || 'Ocorreu uma falha ao cadastrar.';
        },
        complete: () => {
          this.carregando = false;
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
