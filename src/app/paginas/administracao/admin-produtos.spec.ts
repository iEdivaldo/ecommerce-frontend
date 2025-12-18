import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminProdutos } from './admin-produtos';
import { AuthService } from '../../core/auth.service';
import { ApiService } from '../../core/api.service';
import { of, throwError } from 'rxjs';

describe('AdminProdutos', () => {
  let component: AdminProdutos;
  let fixture: ComponentFixture<AdminProdutos>;
  let authService: jasmine.SpyObj<AuthService>;
  let apiService: jasmine.SpyObj<ApiService>;

  const mockUsuario = { id: 1, nome: 'Admin', email: 'admin@exemplo.com', perfil: 'ADMINISTRADOR' };
  
  const mockProdutos = [
    { 
      id: 1, 
      nomeProduto: 'Produto A', 
      precoProduto: 100, 
      codigoProduto: 'ABC123', 
      descricaoProduto: 'Desc A',
      estoqueProduto: 10,
      slugProduto: 'produto-a-abc123',
      produtoAtivo: true,
      categoria: { id: 1, nome: 'Categoria 1' },
      imagemUrl: '/uploads/produtos/imagem1.png'
    },
    { 
      id: 2, 
      nomeProduto: 'Produto B', 
      precoProduto: 50, 
      codigoProduto: 'DEF456', 
      descricaoProduto: 'Desc B',
      estoqueProduto: 5,
      slugProduto: 'produto-b-def456',
      produtoAtivo: true,
      categoria: { id: 2, nome: 'Categoria 2' }
    }
  ];

  const mockCategorias = [
    { id: 1, nome: 'Categoria 1' },
    { id: 2, nome: 'Categoria 2' }
  ];

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], { 
      usuario: signal(mockUsuario) 
    });
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'listarProdutosPorUsuario', 
      'listarCategorias',
      'listarCategoriasPublicas',
      'criarProduto',
      'editarProduto',
      'excluirProduto',
      'uploadImagem'
    ]);
    
    apiServiceSpy.listarProdutosPorUsuario.and.returnValue(of([...mockProdutos]));
    apiServiceSpy.listarCategorias.and.returnValue(of([...mockCategorias]));
    apiServiceSpy.listarCategoriasPublicas.and.returnValue(of([...mockCategorias]));

    await TestBed.configureTestingModule({
      imports: [AdminProdutos, HttpClientTestingModule, RouterTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    })
    .compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;

    fixture = TestBed.createComponent(AdminProdutos);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar produtos ao inicializar', (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      expect(apiService.listarProdutosPorUsuario).toHaveBeenCalledWith(1);
      expect(component.tabelaProdutos.length).toBe(2);
      expect(component.tabelaProdutos[0].nomeProduto).toBe('Produto A');
      done();
    }, 0);
  });

  it('deve carregar categorias ao inicializar', (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      expect(apiService.listarCategorias).toHaveBeenCalled();
      expect(component.listasCategorias.length).toBe(2);
      done();
    }, 0);
  });

  it('deve ordenar produtos por nome', (done) => {
    const produtosDesordenados = [mockProdutos[1], mockProdutos[0]];
    apiService.listarProdutosPorUsuario.and.returnValue(of(produtosDesordenados));
    
    fixture.detectChanges();

    setTimeout(() => {
      expect(component.tabelaProdutos[0].nomeProduto).toBe('Produto A');
      expect(component.tabelaProdutos[1].nomeProduto).toBe('Produto B');
      done();
    }, 0);
  });

  it('deve gerar SKU aleatório', () => {
    component.gerarSku();
    
    expect(component.form.codigoProduto).toBeTruthy();
    expect(component.form.codigoProduto.length).toBeGreaterThan(6);
  });

  it('deve atualizar slug baseado no nome e SKU', () => {
    component.form.codigoProduto = 'ABC123';
    component.atualizarSlug('Produto Teste');
    
    expect(component.form.slugProduto).toBe('produto-teste-ABC123');
  });

  it('deve remover caracteres especiais do slug', () => {
    component.form.codigoProduto = 'TEST123';
    component.atualizarSlug('Produto @#$ Especial!');
    
    expect(component.form.slugProduto).toBe('produto--especial-TEST123');
  });

  it('deve criar produto com sucesso', (done) => {
    apiService.criarProduto.and.returnValue(of({}));
    apiService.listarProdutosPorUsuario.and.returnValue(of([...mockProdutos]));

    component.form = {
      nomeProduto: 'Novo Produto',
      slugProduto: 'novo-produto',
      precoProduto: '100',
      codigoProduto: 'NEW123',
      descricaoProduto: 'Descrição',
      estoqueProduto: '10',
      produtoAtivo: true,
      categoriaId: '1',
      imagemUrl: ''
    };

    fixture.detectChanges();
    component.criar();

    setTimeout(() => {
      expect(apiService.criarProduto).toHaveBeenCalled();
      const payload = apiService.criarProduto.calls.mostRecent().args[0];
      expect(payload.categoria.id).toBe(1);
      expect(payload.categoriaId).toBeUndefined();
      done();
    }, 0);
  });

  it('deve editar produto existente', (done) => {
    apiService.editarProduto.and.returnValue(of({}));
    apiService.listarProdutosPorUsuario.and.returnValue(of([...mockProdutos]));

    fixture.detectChanges();

    component.editarProduto(1, mockProdutos[0]);
    
    expect(component.editando).toBeTruthy();
    expect(component.idProdutoEditando).toBe(1);
    expect(component.form.nomeProduto).toBe('Produto A');
    expect(component.form.categoriaId).toBe('1');

    component.form.nomeProduto = 'Produto Editado';
    component.salvarProduto();

    setTimeout(() => {
      expect(apiService.editarProduto).toHaveBeenCalledWith(1, jasmine.any(Object));
      done();
    }, 0);
  });

  it('deve carregar preview da imagem ao editar produto com imagem', () => {
    fixture.detectChanges();

    component.editarProduto(1, mockProdutos[0]);
    
    expect(component.imagemPreview).toBe('http://localhost:8080/uploads/produtos/imagem1.png');
  });

  it('deve excluir produto após confirmação', (done) => {
    spyOn(window, 'confirm').and.returnValue(true);
    apiService.excluirProduto.and.returnValue(of({}));
    apiService.listarProdutosPorUsuario.and.returnValue(of([mockProdutos[1]]));

    fixture.detectChanges();

    component.excluirProduto(1);

    setTimeout(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(apiService.excluirProduto).toHaveBeenCalledWith(1);
      done();
    }, 0);
  });

  it('não deve excluir produto se usuário cancelar', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    
    fixture.detectChanges();
    component.excluirProduto(1);

    expect(apiService.excluirProduto).not.toHaveBeenCalled();
  });

  it('deve limpar formulário', () => {
    component.form = {
      nomeProduto: 'Teste',
      slugProduto: 'teste',
      precoProduto: '100',
      codigoProduto: 'TEST',
      descricaoProduto: 'Desc',
      estoqueProduto: '5',
      produtoAtivo: true,
      categoriaId: '1',
      imagemUrl: '/test.png'
    };
    component.imagemSelecionada = new File([''], 'test.png');
    component.imagemPreview = 'preview';

    component.limparFormulario();

    expect(component.form.nomeProduto).toBe('');
    expect(component.form.categoriaId).toBe('');
    expect(component.imagemSelecionada).toBeNull();
    expect(component.imagemPreview).toBeNull();
  });

  it('deve validar campos obrigatórios ao salvar', (done) => {
    fixture.detectChanges();

    component.form = {
      nomeProduto: '',
      slugProduto: '',
      precoProduto: '',
      codigoProduto: '',
      descricaoProduto: '',
      estoqueProduto: '',
      produtoAtivo: true,
      categoriaId: '1',
      imagemUrl: ''
    };

    component.salvarProduto();

    setTimeout(() => {
      expect(component.msg).toBe('Por favor, preencha todos os campos obrigatórios.');
      expect(apiService.criarProduto).not.toHaveBeenCalled();
      done();
    }, 0);
  });

  it('deve validar categoria ao salvar', (done) => {
    fixture.detectChanges();

    component.form.categoriaId = '';

    component.salvarProduto();

    setTimeout(() => {
      expect(component.msg).toBe('Por favor, selecione uma categoria.');
      expect(apiService.criarProduto).not.toHaveBeenCalled();
      done();
    }, 0);
  });

  it('deve aceitar estoque zero como válido', (done) => {
    apiService.editarProduto.and.returnValue(of({}));
    apiService.listarProdutosPorUsuario.and.returnValue(of([...mockProdutos]));

    fixture.detectChanges();

    component.form = {
      nomeProduto: 'Produto',
      slugProduto: 'produto',
      precoProduto: '100',
      codigoProduto: 'TEST',
      descricaoProduto: 'Desc',
      estoqueProduto: '0',
      produtoAtivo: true,
      categoriaId: '1',
      imagemUrl: ''
    };
    component.editando = true;
    component.idProdutoEditando = 1;

    component.salvarProduto();

    setTimeout(() => {
      expect(apiService.editarProduto).toHaveBeenCalled();
      expect(component.msg).not.toBe('Por favor, preencha todos os campos obrigatórios.');
      done();
    }, 0);
  });

  it('deve fazer upload de imagem com sucesso', async () => {
    const mockResponse = { url: '/uploads/produtos/nova-imagem.png' };
    apiService.uploadImagem.and.returnValue(of(mockResponse));

    component.imagemSelecionada = new File([''], 'test.png');

    const url = await component.uploadImagem();

    expect(apiService.uploadImagem).toHaveBeenCalled();
    expect(url).toBe('/uploads/produtos/nova-imagem.png');
    expect(component.uploadandoImagem).toBeFalsy();
  });

  it('deve retornar null se não houver imagem selecionada', async () => {
    component.imagemSelecionada = null;

    const url = await component.uploadImagem();

    expect(url).toBeNull();
    expect(apiService.uploadImagem).not.toHaveBeenCalled();
  });

  it('deve remover imagem', () => {
    component.imagemSelecionada = new File([''], 'test.png');
    component.imagemPreview = 'preview-url';
    component.form.imagemUrl = '/test.png';

    component.removerImagem();

    expect(component.imagemSelecionada).toBeNull();
    expect(component.imagemPreview).toBeNull();
    expect(component.form.imagemUrl).toBe('');
  });
});