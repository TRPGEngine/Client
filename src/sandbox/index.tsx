import React from 'react';
import ReactDom from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import { PortalHost } from '@web/utils/portal';

const SandboxStyle = createGlobalStyle`
  body {
    background: none;
  }
`;

function useSandbox() {
  return (
    <div style={{ border: '1px solid red' }}>
      {/* Your Code Here */}
      {/* ============== */}
    </div>
  );
}

const App = () => {
  return (
    <div>
      <PortalHost>
        <SandboxStyle />

        {useSandbox()}
      </PortalHost>
    </div>
  );
};

ReactDom.render(<App />, document.querySelector('#app'));
