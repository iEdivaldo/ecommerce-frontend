import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/api.service';
import { CarrinhoService } from '../../carrinho/carrinho.service';
import { AuthService } from '../../../core/auth.service';
import { TemaService } from '../../../shared/tema/tema.service';

@Component({
  selector: 'app-detalhes-produto',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './detalhes-produto.html'
})
export class DetalhesProduto {
  private rota = inject(ActivatedRoute);
  private api = inject(ApiService);
  private carrinho = inject(CarrinhoService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  auth = inject(AuthService);
  tema = inject(TemaService);
  
  produto: any;
  carregando = true;
  mostrarAlerta = signal(false);
  quantidade = 1;

  ngOnInit() {
    const id = this.rota.snapshot.paramMap.get('id');
    if (id !== null) {
      this.api.obterProduto(id).subscribe({
        next: (dados) => {
          this.produto = dados;
          this.carregando = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.carregando = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  adicionarAoCarrinho() {
    if (!this.auth.autenticado()) {
      if (confirm('Você precisa estar logado para adicionar produtos ao carrinho. Deseja fazer login agora?')) {
        this.router.navigate(['/login']);
      }
      return;
    }

    if (this.produto.estoqueProduto === 0) {
      alert('Este produto está esgotado no momento.');
      return;
    }

    if (this.quantidade > this.produto.estoqueProduto) {
      alert(`Apenas ${this.produto.estoqueProduto} unidades disponíveis em estoque.`);
      return;
    }

    if (this.produto) {
      for (let i = 0; i < this.quantidade; i++) {
        this.carrinho.adicionarItem(this.produto);
      }
      this.mostrarAlerta.set(true);
      setTimeout(() => {
        this.mostrarAlerta.set(false);
      }, 3000);
    }
  }

  diminuirQuantidade() {
    if (this.quantidade > 1) {
      this.quantidade--;
    }
  }

  aumentarQuantidade() {
    const maxQuantidade = this.produto?.estoqueProduto || 99;
    if (this.quantidade < maxQuantidade && this.quantidade < 99) {
      this.quantidade++;
    }
  }
}
