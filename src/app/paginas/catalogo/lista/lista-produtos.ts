import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/api.service';
import { AuthService } from '../../../core/auth.service';
import { FormsModule } from '@angular/forms';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';
import { CarrinhoService } from '../../carrinho/carrinho.service';
@Component({
  selector: 'app-lista-produtos',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lista-produtos.html'
})
export class ListaProdutos {
  private api = inject(ApiService);
  private autenticacao = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  usuarioAtual = this.autenticacao.usuario;
  private carrinho = inject(CarrinhoService);
  mostrarAlerta = signal(false);
  produtos: any[] = [];
  listasCategorias: any[] = [];
  carregando = true;
  mensagens = false;
  categoriaSelecionada: string = '';
  filtroPesquisa: string = '';
  todosProdutos: any[] = [];
  ordenacaoSelecionada: string = '';
  produtoAdicionadoId: number | null = null;

  ngOnInit() {
    this.carregarDados();
    if (this.produtos) {
      this.carregando = false;
    }
    this.carregarDadosCategorias();
    this.identificarUsuario();
  }

  identificarUsuario() {
    if (this.usuarioAtual()) {
      this.mensagens = true;
      setTimeout(() => {
        this.mensagens = false;
        this.cdr.detectChanges();
      }, 3000);
    }
  }

  filtrosUnicos() {
    let base = [...this.todosProdutos];

    // Filtro de Categoria
    if (this.categoriaSelecionada) {
      base = base.filter(p => p.categoria?.id == this.categoriaSelecionada);
    }

    // Filtro de Pesquisa
    if (this.filtroPesquisa) {
      const termo = this.filtroPesquisa.toLowerCase();
      base = base.filter(p => p.nomeProduto.toLowerCase().includes(termo) || (p.descricaoProduto && p.descricaoProduto.toLowerCase().includes(termo)));
    }

    // Manter produtos esgotados no final
    base.sort((a, b) => {
      if (a.estoqueProduto === 0 && b.estoqueProduto > 0) return 1;
      if (a.estoqueProduto > 0 && b.estoqueProduto === 0) return -1;
      return 0;
    });

    this.produtos = base;
    this.cdr.detectChanges();
  }

  filtrarPorPesquisa() {
    this.filtrosUnicos();
  }

  filtrarPorCategoria() {
    this.filtrosUnicos();
  }

  ordenarProdutos(criterio: string) {
    if (criterio === 'precoAsc') {
      this.produtos.sort((a, b) => {
        if (a.estoqueProduto === 0 && b.estoqueProduto > 0) return 1;
        if (a.estoqueProduto > 0 && b.estoqueProduto === 0) return -1;
        return a.precoProduto - b.precoProduto;
      });
    } else if (criterio === 'precoDesc') {
      this.produtos.sort((a, b) => {
        if (a.estoqueProduto === 0 && b.estoqueProduto > 0) return 1;
        if (a.estoqueProduto > 0 && b.estoqueProduto === 0) return -1;
        return b.precoProduto - a.precoProduto;
      });
    } else if (criterio === 'nomeAsc') {
      this.produtos.sort((a, b) => {
        if (a.estoqueProduto === 0 && b.estoqueProduto > 0) return 1;
        if (a.estoqueProduto > 0 && b.estoqueProduto === 0) return -1;
        return a.nomeProduto.localeCompare(b.nomeProduto);
      });
    } else if (criterio === 'nomeDesc') {
      this.produtos.sort((a, b) => {
        if (a.estoqueProduto === 0 && b.estoqueProduto > 0) return 1;
        if (a.estoqueProduto > 0 && b.estoqueProduto === 0) return -1;
        return b.nomeProduto.localeCompare(a.nomeProduto);
      });
    } else if (criterio === '') {
      this.produtos = [...this.todosProdutos];
    }
    this.cdr.detectChanges();
  }

  carregarDadosCategorias() {
    this.api.listarCategoriasPublicas().subscribe((dados: any) => {
      this.listasCategorias = dados.sort((a: { nome: string }, b: { nome: string }) => a.nome.localeCompare(b.nome));
      this.cdr.detectChanges();
    });
  }

  carregarDados() {
    this.api.listarProdutos().subscribe((dados: any) => {
      // Ordenar produtos: disponíveis primeiro, esgotados no final
      const produtosOrdenados = dados.sort((a: any, b: any) => {
        if (a.estoqueProduto === 0 && b.estoqueProduto > 0) return 1;
        if (a.estoqueProduto > 0 && b.estoqueProduto === 0) return -1;
        return 0;
      });
      this.produtos = produtosOrdenados;
      this.todosProdutos = produtosOrdenados;
      this.cdr.detectChanges();
    });
  }

  adicionarAoCarrinho(produto: any) {
    if (!this.autenticacao.autenticado()) {
      if (confirm('Você precisa estar logado para adicionar produtos ao carrinho. Deseja fazer login agora?')) {
        window.location.href = '/login';
      }
      return;
    }

    const usuario = this.usuarioAtual();
    if (usuario && (usuario.perfil === 'ADMINISTRADOR')) {
      alert(`Como ${usuario.perfil === 'ADMINISTRADOR' ? 'vendedor(a)' : 'empreendedor(a)'}, você não pode adicionar produtos ao carrinho. Se deseja comprar, favor sair da conta Sr(a) ${usuario.nome} e fazer login em sua conta pessoal.`);
      return;
    }

    if (produto.estoqueProduto === 0) {
      alert('Este produto está esgotado no momento.');
      return;
    }

    console.log('Adicionando ao carrinho:', produto);
    this.carrinho.adicionarItem(produto);
    this.mostrarAlerta.set(true);
    
    setTimeout(() => {
      this.mostrarAlerta.set(false);
    }, 3000);
  }
}
