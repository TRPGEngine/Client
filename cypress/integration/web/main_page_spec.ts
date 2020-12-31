/// <reference types="cypress" />

import { accountLogin } from 'cypress/utils/login';

describe('The Main Page', () => {
  it('successfully loads', () => {
    cy.visit('/');

    accountLogin();

    cy.url().should('include', '/main/personal/friends');
  });
});
