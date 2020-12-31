/// <reference types="cypress" />

describe('The Login Page', () => {
  it('successfully loads', () => {
    cy.visit('/');

    cy.wait(100); // 等待100ms以让js能来得及跳转
    cy.url().should('include', '/entry/login');

    cy.getByTestId('login-submit-btn').click();

    cy.get('.ant-message-custom-content').should('exist');

    cy.window().should('have.property', 'trpg');

    // cy.get('input[placeholder=用户名]').type('admin8');
    // cy.get('input[placeholder=密码]').type('admin8');
  });

  it('switch register page', () => {
    function checkRegisterTip(str: string) {
      return cy.getByTestId('register-error-tip').contains(str);
    }

    cy.visit('/');

    cy.getByTestId('nav-register-btn').click();

    cy.url().should('include', '/entry/register');

    checkRegisterTip('用户名不能为空');

    cy.get(':nth-child(2) > .ant-input').type('s');
    checkRegisterTip('用户名必须为5到16位英文或数字');

    cy.get(':nth-child(2) > .ant-input').clear().type('testuser');
    checkRegisterTip('密码不能为空');

    cy.get(':nth-child(3) > .ant-input-affix-wrapper > .ant-input').type(
      'testpass'
    );
    checkRegisterTip('重复密码不一致');

    cy.get(':nth-child(4) > .ant-input-affix-wrapper > .ant-input').type(
      'otherpass'
    );
    checkRegisterTip('重复密码不一致');

    cy.get(':nth-child(4) > .ant-input-affix-wrapper > .ant-input')
      .clear()
      .type('testpass');

    cy.getByTestId('register-error-tip').should('not.contain.text');

    cy.getByTestId('nav-login-btn').click();

    cy.url().should('include', '/entry/login');
  });
});
