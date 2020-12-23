/// <reference types="cypress" />

describe('The Login Page', () => {
  it('successfully loads', () => {
    cy.visit('/');

    cy.url().should('include', '/entry/login');

    // cy.get('input[placeholder=用户名]').type('admin8');
    // cy.get('input[placeholder=密码]').type('admin8');
  });
});
