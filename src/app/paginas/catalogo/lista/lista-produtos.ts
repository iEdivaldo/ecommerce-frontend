import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/api.service';
import { AuthService } from '../../../core/auth.service';
@Component({
  selector: 'app-lista-produtos',
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-produtos.html'
})
export class ListaProdutos {
  private api = inject(ApiService);
  private autenticacao = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  usuarioAtual = this.autenticacao.usuario;

  produtos: any[] = [];
  carregando = true;
  mensagens = false;

  ngOnInit() {
    this.api.listarProdutos().subscribe((dados: any) => {
      this.produtos = dados;
      this.carregando = false;
    });

    if (this.usuarioAtual()) {
      this.mensagens = true;
      setTimeout(() => {
        this.mensagens = false;
        this.cdr.detectChanges();
      }, 3000);
    }
  }
}
