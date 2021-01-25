import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { SaucerEditorProvider, SaucerEditor } from '@saucerjs/editor';

import '@saucerjs/editor/assets/default.css';

const Root = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const EditorMain: React.FC = TMemo(() => {
  return (
    <SaucerEditorProvider>
      <Root>
        {/* <Toolbar /> */}

        <hr style={{ margin: 0 }} />

        <div style={{ position: 'relative', flex: 1 }}>
          <SaucerEditor />
        </div>
      </Root>
    </SaucerEditorProvider>
  );
});
EditorMain.displayName = 'EditorMain';
