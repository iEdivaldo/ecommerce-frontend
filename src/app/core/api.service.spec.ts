import 'zone.js';
import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

describe('ApiService - Testes de Integração', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Admin Produtos - CRUD Completo', () => {
    it('deve listar produtos do usuário com requisição correta', () => {
      const usuarioId = 1;
      const mockProdutos = [
        { 
          id: 1, 
          nomeProduto: 'Produto A', 
          precoProduto: 100,
          estoqueProduto: 10,
          categoria: { id: 1, nome: 'Categoria 1' }
        },
        { 
          id: 2, 
          nomeProduto: 'Produto B', 
          precoProduto: 50,
          estoqueProduto: 5,
          categoria: { id: 2, nome: 'Categoria 2' }
        }
      ];

      service.listarProdutosPorUsuario(usuarioId).subscribe((produtos: any) => {
        expect(produtos).toEqual(mockProdutos);
        expect(Array.isArray(produtos)).toBeTruthy();
        expect(produtos.length).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}/administracao/produtos/usuario/${usuarioId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProdutos);
    });

    it('deve criar produto com estrutura correta (categoria como objeto)', () => {
      const novoProduto = {
        nomeProduto: 'Notebook Dell',
        slugProduto: 'notebook-dell-ABC123',
        precoProduto: '3500',
        codigoProduto: 'ABC123',
        descricaoProduto: 'Notebook potente para desenvolvimento',
        estoqueProduto: '10',
        produtoAtivo: true,
        categoria: { id: 1 },
        imagemUrl: '/uploads/produtos/notebook.jpg'
      };

      const mockResposta = { id: 1, ...novoProduto };

      service.criarProduto(novoProduto).subscribe((resposta: any) => {
        expect(resposta).toEqual(mockResposta);
        expect(resposta.id).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}/administracao/produtos`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(novoProduto);
      expect(req.request.body.categoria).toBeDefined();
      expect(req.request.body.categoria.id).toBe(1);
      expect(req.request.body.categoriaId).toBeUndefined();
      req.flush(mockResposta);
    });

    it('deve editar produto existente com payload correto', () => {
      const produtoId = 1;
      const produtoEditado = {
        nomeProduto: 'Produto Atualizado',
        precoProduto: '150',
        estoqueProduto: '5',
        categoria: { id: 2 }
      };

      const mockResposta = { id: produtoId, ...produtoEditado };

      service.editarProduto(produtoId, produtoEditado).subscribe((resposta: any) => {
        expect(resposta).toEqual(mockResposta);
        expect(resposta.id).toBe(produtoId);
      });

      const req = httpMock.expectOne(`${baseUrl}/administracao/produtos/${produtoId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(produtoEditado);
      expect(req.request.body.categoria.id).toBe(2);
      req.flush(mockResposta);
    });

    it('deve excluir produto por ID', () => {
      const produtoId = 1;

      service.excluirProduto(produtoId).subscribe((resposta: any) => {
        expect(resposta).toBeDefined();
      });

      const req = httpMock.expectOne(`${baseUrl}/administracao/produtos/${produtoId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('deve fazer upload de imagem com FormData', () => {
      const file = new File(['conteudo teste'], 'produto.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);

      const mockResposta = { url: '/uploads/produtos/produto-123.jpg' };

      service.uploadImagem(formData).subscribe((resposta: any) => {
        expect(resposta).toEqual(mockResposta);
        expect(resposta.url).toContain('/uploads/produtos/');
        expect(resposta.url).toContain('.jpg');
      });

      const req = httpMock.expectOne(`${baseUrl}/upload/imagem`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBeTruthy();
      req.flush(mockResposta);
    });

    it('deve listar produtos da administração com parâmetros', () => {
      const params = { ativo: 'true', categoria: '1' };
      const mockProdutos = [
        { id: 1, nomeProduto: 'Produto Ativo', produtoAtivo: true }
      ];

      service.listarProdutosAdministracao(params).subscribe((produtos: any) => {
        expect(produtos).toEqual(mockProdutos);
      });

      const req = httpMock.expectOne(r => 
        r.url === `${baseUrl}/administracao/produtos` &&
        r.params.get('ativo') === 'true' &&
        r.params.get('categoria') === '1'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockProdutos);
    });

    it('deve listar categorias da administração', () => {
      const mockCategorias = [
        { id: 1, nome: 'Categoria 1' },
        { id: 2, nome: 'Categoria 2' }
      ];

      service.listarCategorias().subscribe((categorias: any) => {
        expect(categorias).toEqual(mockCategorias);
        expect(categorias.length).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}/administracao/categorias`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategorias);
    });
  });

  describe('Lista Produtos - Catálogo Público', () => {
    it('deve listar produtos sem parâmetros', () => {
      const mockProdutos = [
        { 
          id: 1, 
          nomeProduto: 'Produto A', 
          precoProduto: 100,
          estoqueProduto: 10,
          categoria: { id: 1, nome: 'Categoria 1' }
        },
        { 
          id: 2, 
          nomeProduto: 'Produto B', 
          precoProduto: 50,
          estoqueProduto: 0,
          categoria: { id: 2, nome: 'Categoria 2' }
        },
        { 
          id: 3, 
          nomeProduto: 'Produto C', 
          precoProduto: 200,
          estoqueProduto: 5,
          categoria: { id: 1, nome: 'Categoria 1' }
        }
      ];

      service.listarProdutos().subscribe((produtos: any) => {
        expect(produtos).toEqual(mockProdutos);
        expect(produtos.length).toBe(3);
      });

      const req = httpMock.expectOne(`${baseUrl}/produtos`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush(mockProdutos);
    });

    it('deve listar produtos com parâmetros de filtro', () => {
      const params = { categoria: '1', ordenar: 'preco' };
      const mockProdutos = [
        { id: 1, nomeProduto: 'Produto A', categoria: { id: 1 } }
      ];

      service.listarProdutos(params).subscribe((produtos: any) => {
        expect(produtos).toEqual(mockProdutos);
      });

      const req = httpMock.expectOne(r => 
        r.url === `${baseUrl}/produtos` &&
        r.params.get('categoria') === '1' &&
        r.params.get('ordenar') === 'preco'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockProdutos);
    });

    it('deve obter produto específico por ID', () => {
      const produtoId = '1';
      const mockProduto = {
        id: 1,
        nomeProduto: 'Notebook',
        precoProduto: 3500,
        estoqueProduto: 10,
        descricaoProduto: 'Notebook Dell',
        categoria: { id: 1, nome: 'Eletrônicos' },
        imagemUrl: '/uploads/produtos/notebook.jpg'
      };

      service.obterProduto(produtoId).subscribe((produto: any) => {
        expect(produto).toEqual(mockProduto);
        expect(produto.nomeProduto).toBe('Notebook');
        expect(produto.categoria).toBeDefined();
      });

      const req = httpMock.expectOne(`${baseUrl}/produtos/${produtoId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduto);
    });

    it('deve listar categorias públicas', () => {
      const mockCategorias = [
        { id: 1, nome: 'Eletrônicos' },
        { id: 2, nome: 'Livros' },
        { id: 3, nome: 'Roupas' }
      ];

      service.listarCategoriasPublicas().subscribe((categorias: any) => {
        expect(categorias).toEqual(mockCategorias);
        expect(categorias.length).toBe(3);
      });

      const req = httpMock.expectOne(`${baseUrl}/produtos/categorias`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategorias);
    });

    it('deve listar produtos de uma categoria específica', () => {
      const categoriaId = 1;
      const mockProdutos = [
        { id: 1, nomeProduto: 'Produto A', categoria: { id: 1 } },
        { id: 3, nomeProduto: 'Produto C', categoria: { id: 1 } }
      ];

      service.listarProdutosCategoria(categoriaId).subscribe((produtos: any) => {
        expect(produtos).toEqual(mockProdutos);
        expect(produtos.every((p: any) => p.categoria.id === 1)).toBeTruthy();
      });

      const req = httpMock.expectOne(`${baseUrl}/produtos/categoria/${categoriaId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProdutos);
    });

    it('deve listar categorias públicas com parâmetros', () => {
      const params = { ativo: 'true' };
      const mockCategorias = [
        { id: 1, nome: 'Eletrônicos', ativo: true }
      ];

      service.listarCategoriasPublicas(params).subscribe((categorias: any) => {
        expect(categorias).toEqual(mockCategorias);
      });

      const req = httpMock.expectOne(r => 
        r.url === `${baseUrl}/produtos/categorias` &&
        r.params.get('ativo') === 'true'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockCategorias);
    });
  });

  describe('Tratamento de Erros', () => {
    it('deve tratar erro 404 ao buscar produto inexistente', () => {
      service.obterProduto('999').subscribe(
        () => fail('Deveria ter falhado com erro 404'),
        erro => {
          expect(erro.status).toBe(404);
        }
      );

      const req = httpMock.expectOne(`${baseUrl}/produtos/999`);
      req.flush('Produto não encontrado', { 
        status: 404, 
        statusText: 'Not Found' 
      });
    });

    it('deve tratar erro 400 ao criar produto com dados inválidos', () => {
      const produtoInvalido = { nomeProduto: '' };

      service.criarProduto(produtoInvalido).subscribe(
        () => fail('Deveria ter falhado com erro 400'),
        erro => {
          expect(erro.status).toBe(400);
        }
      );

      const req = httpMock.expectOne(`${baseUrl}/administracao/produtos`);
      req.flush({ message: 'Dados inválidos' }, { 
        status: 400, 
        statusText: 'Bad Request' 
      });
    });

    it('deve tratar erro 401 quando não autenticado', () => {
      service.listarProdutosPorUsuario(1).subscribe(
        () => fail('Deveria ter falhado com erro 401'),
        erro => {
          expect(erro.status).toBe(401);
        }
      );

      const req = httpMock.expectOne(`${baseUrl}/administracao/produtos/usuario/1`);
      req.flush({}, { 
        status: 401, 
        statusText: 'Unauthorized' 
      });
    });

    it('deve tratar erro 500 do servidor', () => {
      service.listarProdutos().subscribe(
        () => fail('Deveria ter falhado com erro 500'),
        erro => {
          expect(erro.status).toBe(500);
        }
      );

      const req = httpMock.expectOne(`${baseUrl}/produtos`);
      req.flush({}, { 
        status: 500, 
        statusText: 'Internal Server Error' 
      });
    });

    it('deve tratar erro ao fazer upload de imagem', () => {
      const formData = new FormData();
      formData.append('file', new File([''], 'test.jpg'));

      service.uploadImagem(formData).subscribe(
        () => fail('Deveria ter falhado'),
        erro => {
          expect(erro.status).toBe(400);
        }
      );

      const req = httpMock.expectOne(`${baseUrl}/upload/imagem`);
      req.flush({ message: 'Arquivo inválido' }, { 
        status: 400, 
        statusText: 'Bad Request' 
      });
    });
  });

  describe('Categorias - CRUD', () => {
    it('deve criar categoria', () => {
      const novaCategoria = { nome: 'Eletrônicos' };
      const mockResposta = { id: 1, nome: 'Eletrônicos' };

      service.criarCategoria(novaCategoria).subscribe((resposta: any) => {
        expect(resposta).toEqual(mockResposta);
        expect(resposta.id).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}/administracao/categorias`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(novaCategoria);
      req.flush(mockResposta);
    });

    it('deve editar categoria', () => {
      const categoriaId = 1;
      const categoriaEditada = { nome: 'Eletrônicos e Games' };
      const mockResposta = { id: categoriaId, nome: 'Eletrônicos e Games' };

      service.editarCategoria(categoriaId, categoriaEditada).subscribe((resposta: any) => {
        expect(resposta).toEqual(mockResposta);
      });

      const req = httpMock.expectOne(`${baseUrl}/administracao/categorias/${categoriaId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(categoriaEditada);
      req.flush(mockResposta);
    });

    it('deve excluir categoria', () => {
      const categoriaId = 1;

      service.excluirCategoria(categoriaId).subscribe((resposta: any) => {
        expect(resposta).toBeDefined();
      });

      const req = httpMock.expectOne(`${baseUrl}/administracao/categorias/${categoriaId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});
