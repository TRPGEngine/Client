import React from 'react';
import styled from 'styled-components';
import { useSidebarContext } from '../SidebarContext';
import { TMemo } from '@shared/components/TMemo';

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

export const ContentDetail = styled.div`
  flex: 1;
  background-color: ${(props) => props.theme.style.contentBackgroundColor};
  display: flex;
  flex-direction: column;
`;

const SidebarContainer = styled.div<{
  showSidebar: boolean;
}>`
  ${(props) => props.theme.mixins.transition('width', 0.2)};
  width: ${(props) => (props.showSidebar ? props.theme.style.sidebarWidth : 0)};
  background-color: ${(props) => props.theme.style.sidebarBackgroundColor};
  overflow: hidden;
`;
export const Sidebar: React.FC = TMemo((props) => {
  const { showSidebar } = useSidebarContext();

  return (
    <SidebarContainer showSidebar={showSidebar}>
      {props.children}
    </SidebarContainer>
  );
});
Sidebar.displayName = 'Sidebar';

export const SidebarHeaderText = styled.div`
  display: flex;
  padding: 10px;
  height: 40px;
  font-weight: bold;
  ${(props) => props.theme.mixins.oneline};
`;

export const SidebarItemsContainer = styled.div`
  padding: 8px;
`;
