import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-admin-produtos',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-produtos.html'
})
export class AdminProdutos {
  private api = inject(ApiService);
  form = {
    nome: '',
    slug: '',
    preco: 0,
    sku: '',
    descricao: '',
    estoque: 0,
    ativo: true
  };
  msg = '';

  criar() {
    this.api.criarProduto(this.form).subscribe({
      next: () => this.msg = 'Produto criado com sucesso!',
      error: (error) => this.msg = 'Erro ao criar produto: ' + error.message
    });
  }
}
