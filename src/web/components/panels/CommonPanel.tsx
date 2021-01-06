import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { CommonHeader } from './CommonHeader';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100vh;
  overflow: hidden;
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
  overflow: hidden;
`;

const RightPanel = styled.div`
  width: ${(props) => props.theme.style.sidebarWidth};
  background-color: ${(props) => props.theme.style.sidebarBackgroundColor};
  padding: 8px;
  overflow: auto;

  ${(props) =>
    props.theme.mixins.mobile('position: absolute;height: 100%;right: 0;')}
`;

interface CommonPanelProps {
  header: React.ReactNode;
  style?: React.CSSProperties;
  headerPrefix?: React.ReactNode;
  headerActions?: React.ReactNode[];
  headerSuffix?: React.ReactNode;
  rightPanel?: React.ReactNode;
}
export const CommonPanel: React.FC<CommonPanelProps> = TMemo((props) => {
  return (
    <Root style={props.style}>
      <CommonHeader
        headerPrefix={props.headerPrefix}
        headerActions={props.headerActions}
        headerSuffix={props.headerSuffix}
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
