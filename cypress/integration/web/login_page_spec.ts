/// <reference types="cypress" />

describe('The Login Page', () => {
  it('successfully loads', () => {
    cy.visit('/');

    cy.wait(100); // 等待100ms以让js能来得及跳转
    cy.url().should('include', '/entry/login');

    // cy.get('input[placeholder=用户名]').type('admin8');
    // cy.get('input[placeholder=密码]').type('admin8');
  });

  it('switch register page', () => {
    cy.visit('/');

    cy.getByTestId('register-btn').click();

    cy.url().should('include', '/entry/register');
  });
});
