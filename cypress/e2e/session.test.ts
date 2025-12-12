describe('useSession behavior', () => {
  beforeEach(() => {
    cy.setCookie('_consent', 'true');
  });

  it('shows logged in state with valid token', () => {
    cy.then(() => {
      let userCookie = Cypress.env('userCookie');
      if (typeof userCookie === 'object') {
        userCookie = JSON.stringify(userCookie);
      }
      Cypress.log({
        name: 'diagnostics:userCookie',
        message: [
          `type=${typeof userCookie}`,
          `present=${Boolean(userCookie)}`,
          `stringLength=${typeof userCookie === 'string' ? userCookie.length : 'n/a'}`,
          `preview=${userCookie.substring(0, 50)}...`,
        ],
      });
    });

    cy.setCookie('_datacite', String(Cypress.env('userCookie')), { log: false });
    cy.visit('/');
    cy.get('#sign-in').should('contain.text', 'DataCite Test User'); // Match your JWT payload name
  });

  it('shows logged out state without token', () => {
    cy.visit('/');
    cy.get('#sign-in').should('contain.text', 'Sign In');
  });

  it('shows logged out state with invalid token', () => {
    cy.setCookie('_datacite', '{"authenticated":{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.invalid.signature"}}', { log: false });
    cy.visit('/');
    cy.get('#sign-in').should('contain.text', 'Sign In');
  });
});