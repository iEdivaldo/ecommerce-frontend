import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-admin-produtos',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-produtos.html'
})
export class AdminProdutos {
  private autenticacao = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private api = inject(ApiService);
  usuarioAtual = this.autenticacao.usuario;
  editando = false;
  idProdutoEditando: number | null = null;

  form = {
    nomeProduto: '',
    slugProduto: '',
    precoProduto: '',
    codigoProduto: '',
    descricaoProduto: '',
    estoqueProduto: '',
    produtoAtivo: true,
    categoriaId: ''
  };
  msg = '';
  tabelaProdutos: any[] = [];
  listasCategorias: any[] = [];
  carregando = true;

  ngOnInit() {
    this.carregarProdutos();
    this.carregarCategorias();
  }

  criar() {
    this.form.produtoAtivo = true;
    this.atualizarSlug(this.form.nomeProduto);

    const payload: { [key: string]: any; categoriaId?: string } = { 
      ...this.form,
      categoria:  { id: Number(this.form.categoriaId) }
     };
    if ('categoriaId' in payload) {
      delete payload.categoriaId;
    }

    this.api.criarProduto(payload).subscribe(() => {
      this.carregarProdutos();
      this.carregando = false;
      this.cdr.detectChanges();
      this.limparFormulario();
    });
  }

  carregarProdutos() {
    console.log("Carregando produtos do usuário:", this.usuarioAtual()!.id);
    this.api.listarProdutosPorUsuario(this.usuarioAtual()!.id).subscribe((dados: any) => {
      console.log("Produtos carregados:", dados);
      this.tabelaProdutos = dados.sort((a: any, b: any) => a.nomeProduto.localeCompare(b.nomeProduto));
      this.carregando = false;
      this.cdr.detectChanges();
    });
  }

  editarProduto(id: number, produto: any) {
    this.editando = true;
    this.idProdutoEditando = id;
    this.form = { ...produto, categoriaId: produto.categoria?.id || produto.categoriaId };
    this.cdr.detectChanges();
  }  
  
  salvarProduto() {
    if (!this.form.categoriaId) {
      this.msg = 'Por favor, selecione uma categoria.';
      return;
    }

    if (!this.form.nomeProduto || !this.form.precoProduto || !this.form.codigoProduto || !this.form.estoqueProduto) {
      this.msg = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    const payload: { [key: string]: any; categoriaId?: string } = { 
      ...this.form,
      categoria:  { id: Number(this.form.categoriaId) }
     };
    if ('categoriaId' in payload) {
      delete payload.categoriaId; // Remover categoriaId do payload
    }

    if (this.editando && this.idProdutoEditando !== null) {
      this.api.editarProduto(this.idProdutoEditando!, payload).subscribe(() => {
        this.carregarProdutos();
        this.editando = false;
        this.idProdutoEditando = null;
        this.limparFormulario();
      });
    } else {
      this.criar();
    }
  }

  limparFormulario() {
    this.form = {
      nomeProduto: '',
      slugProduto: '',
      precoProduto: '',
      codigoProduto: '',
      descricaoProduto: '',
      estoqueProduto: '',
      produtoAtivo: true,
      categoriaId: ''
    };
    this.cdr.detectChanges();
  }

  excluirProduto(id: number) {
    if (confirm('Tem certeza que deseja excluir este produto chamado: ' + this.tabelaProdutos.find(p => p.id === id)?.nomeProduto + '?')) {
      this.api.excluirProduto(id).subscribe(() => {
        this.carregarProdutos();
        this.cdr.detectChanges();
      });
    }
  }

  atualizarSlug(nome: string) {    
    const nomeSlug = nome.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const sku = this.form.codigoProduto ? this.form.codigoProduto : '';
    this.form.slugProduto = `${nomeSlug}-${sku}`;
  }

  gerarSku() {
    const caracteres = Math.random().toString(36).substring(2, 8).toUpperCase();
    const numeros = Math.floor(1000 + Math.random() * 9000);
    this.form.codigoProduto = `${caracteres}${numeros}`;
  }

  carregarCategorias() {
    this.api.listarCategorias().subscribe((dados: any) => {
      this.listasCategorias = dados.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
      this.carregando = false;
      this.cdr.detectChanges();
    });
  }
}
