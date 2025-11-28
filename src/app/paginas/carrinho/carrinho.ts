import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CarrinhoService } from './carrinho.service';

@Component({
  selector: 'app-carrinho',
  imports: [CommonModule],
  templateUrl: './carrinho.html'
})
export class Carrinho {
  private carrinho = inject(CarrinhoService)
  loading = false;
  carrinhoItems = this.carrinho.itensCarrinho;

  get totalCarrinho(): number {
    return this.carrinho.calcularTotal();
  }

  ngOnInit() {
    this.carrinho.itensCarrinho();
  }

  removerItem(id: number) {
    this.carrinho.removerItem(id);
  }

  alterarQuantidade(id: number, quantidade: number) {
    this.carrinho.alterarQuantidade(id, quantidade);
  }

  finalizarCompra() {
    alert('Compra finalizada com sucesso!');
    this.carrinho.limparCarrinho();
  }
}
