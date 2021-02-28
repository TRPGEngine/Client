import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import {
  Inspector,
  SaucerEditorProvider,
  TemplateMenu,
  TreeView,
  Viewport,
} from '@saucerjs/editor';
import '@saucerjs/editor/assets/default.css';
import {
  LayoutProviderContainer,
  XMLErrorBoundary,
} from '@shared/components/layout/XMLBuilder';
import SplitPane from '@shared/components/web/SplitPane';

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
          <SplitPane split="vertical" minSize={180}>
            <TemplateMenu />

            <SplitPane split="vertical" primary="second" minSize={240}>
              {/* 主渲染内容 */}
              <XMLErrorBoundary>
                <LayoutProviderContainer style={{ height: '100%' }}>
                  <Viewport />
                </LayoutProviderContainer>
              </XMLErrorBoundary>

              <SplitPane
                split="horizontal"
                minSize={240}
                pane2Style={{ overflow: 'auto' }}
              >
                <TreeView />
                <Inspector />
              </SplitPane>
            </SplitPane>
          </SplitPane>
        </div>
      </Root>
    </SaucerEditorProvider>
  );
});
EditorMain.displayName = 'EditorMain';
