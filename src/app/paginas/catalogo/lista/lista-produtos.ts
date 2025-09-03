import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  usuarioAtual = this.autenticacao.usuario()?.nome;

  produtos: any[] = [];
  carregando = true;

  ngOnInit() {
    this.api.listarProdutos().subscribe((dados: any) => {
      this.produtos = Array.isArray(dados) ? dados : (dados.conteudo ?? []);
      this.carregando = false;
    });
  }
}
