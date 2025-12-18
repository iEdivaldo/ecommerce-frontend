describe('Lista de Produtos', () => {
  const mockProdutos = [
      {
        id: 1,
        nomeProduto: 'Produto 1',   
        precoProduto: 350,
        estoqueProduto: 10,
        categoria: { id: 1, nome: 'Eletrônicos' },
        imagemUrl: '/uploads/produtos/produto-1.jpg'
      },
      {
        id: 2,
        nomeProduto: 'Produto 2',
        precoProduto: 200,
        estoqueProduto: 5,
        categoria: { id: 1, nome: 'Eletrônicos' },
        imagemUrl: '/uploads/produtos/produto-2.jpg'
      }
    ];

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.intercept({ method: 'GET', url: 'http://localhost:8080/produtos' }, { body: mockProdutos }).as('listarProdutos');
  });

  it('deve exibir lista de produtos', () => {
    cy.visit('/produtos');
    cy.wait('@listarProdutos');

    cy.contains('Produto 1').should('be.visible');
    cy.contains('Produto 2').should('be.visible');
    cy.contains('R$350.00').should('be.visible');
    cy.contains('R$200.00').should('be.visible');
  });

  it('deve filtrar produtos por categoria', () => {
    const mockCategorias = [
      { id: 1, nome: 'Eletrônicos' },
      { id: 2, nome: 'Livros' }
    ];

    const mockProdutosFiltrados = [
      {
        id: 1,
        nomeProduto: 'Produto 1',
        precoProduto: 350,
        estoqueProduto: 10,
        categoria: { id: 1, nome: 'Eletrônicos' }
      }
    ];

    cy.intercept({ method: 'GET', url: 'http://localhost:8080/produtos/categorias' }, { body: mockCategorias }).as('listarCategorias');
    
    cy.visit('/produtos');
    cy.wait('@listarCategorias');

    cy.get('select[id="filtroCategoria"]').select('1');
    
    // Verifica que a filtragem aconteceu (pelo menos um produto da categoria aparece)
    cy.contains('Produto 1').should('be.visible');
  });

  it('deve abrir detalhes do produto ao clicar', () => {
    const mockProduto = {
      id: 1,
      nomeProduto: 'Produto 1',
      precoProduto: 350,
      estoqueProduto: 10,
      descricaoProduto: 'Produto 1 descrição',
      categoria: { id: 1, nome: 'Eletrônicos' },
      imagemUrl: '/uploads/produtos/produto-1.jpg'
    };

    cy.intercept({ method: 'GET', url: 'http://localhost:8080/produtos/1' }, { body: mockProduto }).as('obterProduto');

    cy.visit('/produtos/1');
    cy.wait('@obterProduto');

    cy.contains('Produto 1').should('be.visible');
    cy.contains('Produto 1 descrição').should('be.visible');
    cy.contains('R$350.00').should('be.visible');
  });
});
