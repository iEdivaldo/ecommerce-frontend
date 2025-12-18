describe('Administração de Produtos', () => {
  beforeEach(() => {
    // Fazer login como admin
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'admin-token-123');
      win.localStorage.setItem('usuario', JSON.stringify({
        id: 1,
        nome: 'Admin',
        email: 'admin@exemplo.com',
        perfil: 'ADMINISTRADOR'
      }));
    });
    
    cy.intercept({ method: 'GET', url: '**/administracao/categorias' }, {
      statusCode: 200,
      body: [{ id: 1, nome: 'Eletrônicos' }]
    });
  });

  it('deve listar produtos do administrador', () => {
    const mockProdutos = [
      { id: 1, nomeProduto: 'Produto 1', precoProduto: 100, estoqueProduto: 10, categoria: { id: 1, nome: 'Categoria 1' } },
      { id: 2, nomeProduto: 'Produto 2', precoProduto: 200, estoqueProduto: 5, categoria: { id: 2, nome: 'Categoria 2' } }
    ];

    cy.intercept({ method: 'GET', url: '**/administracao/produtos/usuario/*' }, { body: mockProdutos }).as('listarProdutos');
    cy.visit('/administracao/produtos');
    cy.wait('@listarProdutos');

    cy.contains('Produto 1').should('be.visible');
    cy.contains('Produto 2').should('be.visible');
  });

  it('deve criar novo produto', () => {
    cy.intercept({ method: 'GET', url: '**/administracao/produtos/usuario/*' }, { body: [] });
    cy.intercept({ method: 'POST', url: '**/administracao/produtos' }, { statusCode: 201, body: { id: 3 } }).as('criar');

    cy.visit('/administracao/produtos');
    cy.get('input[name="nome"]').type('Produto 3');
    cy.get('input[name="preco"]').type('500');
    cy.get('input[name="estoque"]').type('3');
    cy.get('button[name="gerarSku"]').click();
    cy.get('select[name="categoriaId"]').select('1');
    cy.get('textarea[name="descricao"]').type('Descrição do Produto 3');
    cy.get('button[name="submit"]').click();
    
    cy.wait('@criar');
  });

  it('deve editar produto existente', () => {
    const produto = { id: 1, nomeProduto: 'Produto 1', precoProduto: 100, estoqueProduto: 10, codigoProduto: 'ABC123', categoria: { id: 1 } };
    
    cy.intercept({ method: 'GET', url: '**/administracao/produtos/usuario/*' }, { body: [produto] });
    cy.intercept({ method: 'PUT', url: '**/administracao/produtos/1' }, { body: { ...produto, nomeProduto: 'Editado' } }).as('editar');

    cy.visit('/administracao/produtos');
    cy.contains('button', 'Editar').click();
    cy.get('input[name="nome"]').should('have.value', 'Produto 1').clear().type('Produto Editado');
    cy.get('button[name="submit"]').click();
    
    cy.wait('@editar');
  });

  it('deve excluir produto', () => {
    const produto = { id: 1, nomeProduto: 'Produto 1', precoProduto: 100, estoqueProduto: 10, categoria: { id: 1 } };
    
    cy.intercept({ method: 'GET', url: '**/administracao/produtos/usuario/*' }, { body: [produto] });
    cy.intercept({ method: 'DELETE', url: '**/administracao/produtos/1' }, { body: {} }).as('excluir');

    cy.visit('/administracao/produtos');
    cy.contains('button', 'Excluir').click();
    
    cy.wait('@excluir');
  });
});