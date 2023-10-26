import i18n from '../../../../src/plugins/i18n';

describe('Should login the user or show an error', () => {
  beforeEach(() => {
    cy.importEssentials();
    cy.visit(`/login/admin`);
    cy.viewport('macbook-16');
  });
  it('should log in properly', () => {
    cy.getByDataCy('input-email').type('clienteb2b@cliente.com.br');
    cy.getByDataCy('input-password').type('7945Rmo5@HbB');
    cy.intercept('POST', '/api/usuario/admin/login').as('login');
    cy.getByDataCy('btn-login').click();

    cy.wait('@login').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
    });
  });
  it('Should show an error message when user don`t complete the required fields', () => {
    cy.getByDataCy('btn-login').click();
    cy.getByDataCy('input-email', '.v-messages__message').should(
      'have.text',
      i18n.global.t('validation.email.required'),
    );
    cy.getByDataCy('input-password', '.v-messages__message').should(
      'have.text',
      i18n.global.t('validation.password.required'),
    );
  });

  it('Should show an error message when user inputs an invalid e-mail', () => {
    cy.getByDataCy('input-email').type('invalidemail@invalidemail$$$');

    cy.getByDataCy('input-email', '.v-messages__message').should(
      'have.text',
      i18n.global.t('validation.email.invalid'),
    );
  });

  it('Should show an error message when user credentials fail', () => {
    cy.getByDataCy('input-email').type('unexistentemail@gmail.com');
    cy.getByDataCy('input-password').type('somewrongpassword');
    cy.intercept('POST', '/api/usuario/admin/login').as('login');
    cy.getByDataCy('btn-login').click();

    cy.wait('@login').then(({ response }) => {
      expect(response.statusCode).to.eq(401);
    });

    cy.getByDataCy('input-email', '.v-messages__message').should(
      'have.text',
      i18n.global.t('validation.email.incorrect'),
    );

    cy.getByDataCy('input-password', '.v-messages__message').should(
      'have.text',
      i18n.global.t('validation.password.incorrect'),
    );
  });

  it('Should go to client login if the link is clicked', () => {
    cy.getByDataCy('link-login').click();

    cy.url().should('eq', 'http://localhost:5173/login');

    cy.getByDataCy('input-email');
    cy.getByDataCy('input-password');
    cy.getByDataCy('btn-login');
  });
});
