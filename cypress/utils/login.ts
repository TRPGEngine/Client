/**
 * Cypress: 快速账号登录
 */
export function accountLogin() {
  cy.window().then(async (win) => {
    win.trpg.quicklogin('admin8', 'admin');
  });

  cy.getByTestId('main-page-root').should('exist');
}
