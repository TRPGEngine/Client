import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { CommonHeader } from './CommonHeader';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100vh;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: auto;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const RightPanel = styled.div`
  width: ${(props) => props.theme.style.sidebarWidth};
  background-color: ${(props) => props.theme.style.sidebarBackgroundColor};
  padding: 8px;
`;

interface CommonPanelProps {
  header: React.ReactNode;
  style?: React.CSSProperties;
  headerPrefix?: React.ReactNode;
  headerActions?: React.ReactNode[];
  rightPanel?: React.ReactNode;
}
export const CommonPanel: React.FC<CommonPanelProps> = TMemo((props) => {
  return (
    <Root style={props.style}>
      <CommonHeader
        headerPrefix={props.headerPrefix}
        headerActions={props.headerActions}
      >
        {props.header}
      </CommonHeader>
      <Main>
        <Content>{props.children}</Content>

        {props.rightPanel && <RightPanel>{props.rightPanel}</RightPanel>}
      </Main>
    </Root>
  );
});
CommonPanel.displayName = 'CommonPanel';
