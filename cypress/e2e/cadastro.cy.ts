describe('Cadastro de Usuário', () => {
  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    cy.clearLocalStorage();
  });

  it('deve cadastrar novo usuário com sucesso', () => {
    cy.visit('/cadastro');
    
    // Preencher formulário
    cy.get('input[name="nome"]').first().type('Edivaldo José dos Santos');
    cy.get('input[type="email"]').type('edivaldo@email.com');
    cy.get('input[type="password"]').first().type('senha123');
    cy.get('input[type="password"]').last().type('senha123');
    
    // Interceptar chamada ao backend
    cy.intercept('POST', '**/autenticacao/registrar', {
      statusCode: 200,
      body: {
        tokens: { tokenAcesso: 'token123' },
        usuario: { id: 1, nome: 'Edivaldo José dos Santos', email: 'edivaldo@email.com' }
      }
    }).as('registrar');
    
    // Submeter
    cy.get('button[name="submit"]').click();
    
    // Aguardar resposta
    cy.wait('@registrar');
    
    // Verificar redirecionamento
    cy.url().should('include', '/produtos');
  });

  it('deve mostrar erro com email inválido', () => {
    cy.visit('/cadastro');
    
    cy.get('input[name="nome"]').first().type('Edivaldo José dos Santos');
    cy.get('input[name="email"]').type('emailinvalido');
    cy.get('input[name="senha"]').first().type('senha123');
    cy.get('input[name="confirmacaoSenha"]').last().type('senha123');
    cy.get('button[name="submit"]').click();
    
    // Verificar mensagem de erro
    cy.contains('email válido', { matchCase: false }).should('be.visible');
  });

  it('deve mostrar erro quando senhas não coincidem', () => {
    cy.visit('/cadastro');
    
    cy.get('input[name="nome"]').first().type('Edivaldo José dos Santos');
    cy.get('input[name="email"]').type('edivaldo@email.com');
    cy.get('input[name="senha"]').first().type('senha123');
    cy.get('input[name="confirmacaoSenha"]').last().type('senha456');
    cy.get('button[name="submit"]').click();
    
    cy.contains('senhas não coincidem', { matchCase: false }).should('be.visible');
  });

  it('deve mostrar erro quando email já está cadastrado', () => {
    cy.visit('/cadastro');
    
    cy.get('input[name="nome"]').first().type('Edivaldo José dos Santos');
    cy.get('input[name="email"]').type('edivaldo@email.com');
    cy.get('input[name="senha"]').first().type('senha123');
    cy.get('input[name="confirmacaoSenha"]').last().type('senha123');
    
    // Interceptar com erro
    cy.intercept('POST', '**/autenticacao/registrar', {
      statusCode: 400,
      body: { message: 'Email já cadastrado' }
    }).as('registrarErro');
    
    cy.get('button[name="submit"]').click();
    cy.wait('@registrarErro');
    
    cy.contains('Email já cadastrado').should('be.visible');
  });
});
