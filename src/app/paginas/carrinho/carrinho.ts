import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CarrinhoService } from './carrinho.service';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-carrinho',
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './carrinho.html'
})
export class Carrinho {
  carrinho = inject(CarrinhoService)
  loading = false;
  carrinhoItems = this.carrinho.itensCarrinho;
  alerta = this.carrinho.alerta;
  produtosComEstoqueInsuficiente = this.carrinho.produtosComEstoqueInsuficiente;
  carrinhoValido = this.carrinho.carrinhoValido;
  private intervaloAtualizacao?: number;

  get totalCarrinho(): number {
    return this.carrinho.calcularTotal();
  }

  ngOnInit() {
    this.carrinho.itensCarrinho();
    this.carrinho.atualizarEstoqueTodosProdutos();
    this.intervaloAtualizacao = window.setInterval(() => {
      this.carrinho.atualizarEstoqueTodosProdutos();
    }, 5000);
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
