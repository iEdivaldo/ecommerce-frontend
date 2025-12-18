import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaProdutos } from './lista-produtos';
import { ApiService } from '../../../core/api.service';
import { AuthService } from '../../../core/auth.service';
import { CarrinhoService } from '../../carrinho/carrinho.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListaProdutos', () => {
  let component: ListaProdutos;
  let fixture: ComponentFixture<ListaProdutos>;
  let apiService: jasmine.SpyObj<ApiService>;
  let authService: jasmine.SpyObj<AuthService>;
  let carrinhoService: jasmine.SpyObj<CarrinhoService>;

  const mockProdutos = [
    { id: 1, nomeProduto: 'Produto A', precoProduto: 100, estoqueProduto: 10, categoria: { id: 1, nome: 'Categoria 1' }, descricaoProduto: 'Desc A' },
    { id: 2, nomeProduto: 'Produto B', precoProduto: 50, estoqueProduto: 0, categoria: { id: 2, nome: 'Categoria 2' }, descricaoProduto: 'Desc B' },
    { id: 3, nomeProduto: 'Produto C', precoProduto: 200, estoqueProduto: 5, categoria: { id: 1, nome: 'Categoria 1' }, descricaoProduto: 'Desc C' }
  ];

  const mockCategorias = [
    { id: 1, nome: 'Categoria 1' },
    { id: 2, nome: 'Categoria 2' }
  ];

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['listarProdutos', 'listarCategoriasPublicas']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['autenticado'], { usuario: signal(null) });
    const carrinhoServiceSpy = jasmine.createSpyObj('CarrinhoService', ['adicionarItem']);

    await TestBed.configureTestingModule({
      imports: [ListaProdutos, HttpClientTestingModule, RouterTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CarrinhoService, useValue: carrinhoServiceSpy }
      ]
    })
    .compileComponents();

    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    carrinhoService = TestBed.inject(CarrinhoService) as jasmine.SpyObj<CarrinhoService>;

    apiService.listarProdutos.and.returnValue(of([...mockProdutos]));
    apiService.listarCategoriasPublicas.and.returnValue(of([...mockCategorias]));

    fixture = TestBed.createComponent(ListaProdutos);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar produtos ao inicializar', (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      expect(apiService.listarProdutos).toHaveBeenCalled();
      expect(component.produtos.length).toBe(3);
      expect(component.todosProdutos.length).toBe(3);
      done();
    }, 0);
  });

  it('deve carregar categorias ao inicializar', (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      expect(apiService.listarCategoriasPublicas).toHaveBeenCalled();
      expect(component.listasCategorias.length).toBe(2);
      done();
    }, 0);
  });

  it('deve ordenar produtos colocando esgotados no final', (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      expect(component.produtos[0].estoqueProduto).toBeGreaterThan(0);
      expect(component.produtos[1].estoqueProduto).toBeGreaterThan(0);
      expect(component.produtos[2].estoqueProduto).toBe(0);
      done();
    }, 0);
  });

  it('deve filtrar produtos por categoria', (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      component.categoriaSelecionada = '1';
      component.filtrarPorCategoria();

      expect(component.produtos.length).toBe(2);
      expect(component.produtos.every(p => p.categoria.id === 1)).toBeTruthy();
      done();
    }, 0);
  });

  it('deve filtrar produtos por pesquisa no nome', (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      component.filtroPesquisa = 'Produto A';
      component.filtrarPorPesquisa();

      expect(component.produtos.length).toBe(1);
      expect(component.produtos[0].nomeProduto).toBe('Produto A');
      done();
    }, 0);
  });

  it('deve filtrar produtos por pesquisa na descrição', (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      component.filtroPesquisa = 'Desc B';
      component.filtrarPorPesquisa();

      expect(component.produtos.length).toBe(1);
      expect(component.produtos[0].descricaoProduto).toBe('Desc B');
      done();
    }, 0);
  });

  it('deve ordenar produtos por preço crescente', (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      component.ordenarProdutos('precoAsc');

      expect(component.produtos[0].precoProduto).toBe(100);
      expect(component.produtos[1].precoProduto).toBe(200);
      // Produto esgotado deve estar no final
      expect(component.produtos[2].estoqueProduto).toBe(0);
      done();
    }, 0);
  });

  it('deve ordenar produtos por preço decrescente', (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      component.ordenarProdutos('precoDesc');

      expect(component.produtos[0].precoProduto).toBe(200);
      expect(component.produtos[1].precoProduto).toBe(100);
      // Produto esgotado deve estar no final
      expect(component.produtos[2].estoqueProduto).toBe(0);
      done();
    }, 0);
  });

  it('deve ordenar produtos por nome crescente', (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      component.ordenarProdutos('nomeAsc');

      expect(component.produtos[0].nomeProduto).toBe('Produto A');
      expect(component.produtos[1].nomeProduto).toBe('Produto C');
      // Produto esgotado deve estar no final
      expect(component.produtos[2].nomeProduto).toBe('Produto B');
      done();
    }, 0);
  });

  it('deve ordenar produtos por nome decrescente', (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      component.ordenarProdutos('nomeDesc');

      expect(component.produtos[0].nomeProduto).toBe('Produto C');
      expect(component.produtos[1].nomeProduto).toBe('Produto A');
      // Produto esgotado deve estar no final
      expect(component.produtos[2].nomeProduto).toBe('Produto B');
      done();
    }, 0);
  });

  it('deve adicionar produto ao carrinho quando autenticado', (done) => {
    authService.autenticado.and.returnValue(true);
    fixture.detectChanges();

    setTimeout(() => {
      const produto = component.produtos[0];
      component.adicionarAoCarrinho(produto);

      expect(carrinhoService.adicionarItem).toHaveBeenCalledWith(produto);
      expect(component.mostrarAlerta()).toBeTruthy();
      done();
    }, 0);
  });

  it('não deve adicionar produto esgotado ao carrinho', (done) => {
    authService.autenticado.and.returnValue(true);
    spyOn(window, 'alert');
    fixture.detectChanges();

    setTimeout(() => {
      const produtoEsgotado = component.produtos.find(p => p.estoqueProduto === 0);
      component.adicionarAoCarrinho(produtoEsgotado);

      expect(window.alert).toHaveBeenCalledWith('Este produto está esgotado no momento.');
      expect(carrinhoService.adicionarItem).not.toHaveBeenCalled();
      done();
    }, 0);
  });

  it('deve solicitar login quando não autenticado', (done) => {
    authService.autenticado.and.returnValue(false);
    spyOn(window, 'confirm').and.returnValue(false);
    fixture.detectChanges();

    setTimeout(() => {
      const produto = component.produtos[0];
      component.adicionarAoCarrinho(produto);

      expect(window.confirm).toHaveBeenCalledWith('Você precisa estar logado para adicionar produtos ao carrinho. Deseja fazer login agora?');
      expect(carrinhoService.adicionarItem).not.toHaveBeenCalled();
      done();
    }, 0);
  });

  it('deve manter produtos esgotados no final após filtros', (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      component.filtroPesquisa = 'Produto';
      component.filtrarPorPesquisa();

      const ultimoProduto = component.produtos[component.produtos.length - 1];
      expect(ultimoProduto.estoqueProduto).toBe(0);
      done();
    }, 0);
  });

  it('deve resetar para todos produtos quando ordenação vazia', (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      component.categoriaSelecionada = '1';
      component.filtrarPorCategoria();
      expect(component.produtos.length).toBe(2);

      component.ordenarProdutos('');
      expect(component.produtos.length).toBe(3);
      done();
    }, 0);
  });
});