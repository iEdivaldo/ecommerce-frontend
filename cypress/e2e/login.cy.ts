describe('Login de Usuário', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('deve fazer login com sucesso', () => {
    cy.visit('/login');
    
    cy.get('input[type="email"]').clear().type('admin@exemplo.com');
    cy.get('input[type="password"]').clear().type('admin');
    
    cy.intercept('POST', '**/autenticacao/login', {
      statusCode: 200,
      body: {
        tokens: { tokenAcesso: 'token123' },
        usuario: { id: 1, nome: 'Admin', email: 'admin@exemplo.com', perfil: 'ADMINISTRADOR' }
      }
    }).as('login');
    
    cy.get('button[name="submit"]').click();
    cy.wait('@login');
    
    cy.url().should('include', '/produtos');
  });

  it('deve mostrar erro com credenciais inválidas', () => {
    cy.visit('/login');
    
    cy.get('input[name="email"]').clear().type('admin@exemplo.com');
    cy.get('input[name="senha"]').clear().type('senhaerrada');
    
    cy.intercept('POST', '**/autenticacao/login', {
      statusCode: 401,
      body: { message: 'Credenciais inválidas' }
    }).as('loginErro');
    
    cy.get('button[name="submit"]').click();
    cy.wait('@loginErro');
    
    cy.contains('Credenciais inválidas').should('be.visible');
  });

  it('deve mostrar erro com email inválido', () => {
    cy.visit('/login');
    
    cy.get('input[name="email"]').clear().type('emailinvalido');
    cy.get('input[name="senha"]').clear().type('senha123');
    cy.get('button[name="submit"]').click();
    
    cy.contains('email válido', { matchCase: false }).should('be.visible');
  });
});
