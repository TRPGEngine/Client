import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { MainContent } from './Content';
import { MainNavbar } from './Navbar';
import { SidebarContextProvider } from './SidebarContext';

const Root = styled.div.attrs({
  'data-testid': 'main-page-root',
})`
  width: 100vw;
  height: 100vh;
  position: relative;
`;

const BaseContent = styled.div`
  display: flex;
  overflow: hidden;
  position: absolute;
  left: 72px;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: ${(props) => props.theme.style.contentBackgroundColor};
`;

export const MainRoute: React.FC = TMemo(() => {
  return (
    <SidebarContextProvider>
      <Root>
        <MainNavbar />
        <BaseContent>
          <MainContent />
        </BaseContent>
      </Root>
    </SidebarContextProvider>
  );
});
MainRoute.displayName = 'MainRoute';
