import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useSidebarContext } from '../SidebarContext';
import { TMemo } from '@shared/components/TMemo';
import _isNil from 'lodash/isNil';
import { useIsMobile } from '@web/hooks/useIsMobile';

const PageContentRoot = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const ContentDetail = styled.div`
  flex: 1;
  background-color: ${(props) => props.theme.style.contentBackgroundColor};
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 768px) {
    width: ${(props) => `calc(100vw - ${props.theme.style.navbarWidth})`};
  }
`;

const ContentDetailMask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
`;

const SidebarContainer = styled.div<{
  showSidebar: boolean;
}>`
  ${(props) => props.theme.mixins.transition('width', 0.2)};
  width: ${(props) => (props.showSidebar ? props.theme.style.sidebarWidth : 0)};
  background-color: ${(props) => props.theme.style.sidebarBackgroundColor};
  overflow: hidden;
`;

interface PageContentProps {
  sidebar?: React.ReactNode;
}

/**
 * 用于渲染实际页面的组件，即除了导航栏剩余的内容
 */
export const PageContent: React.FC<PageContentProps> = TMemo((props) => {
  const { sidebar, children } = props;
  const { showSidebar, setShowSidebar } = useSidebarContext();
  const isMobile = useIsMobile();
  const handleHideSidebar = useCallback(() => {
    setShowSidebar(false);
  }, []);

  const sidebarEl = _isNil(sidebar) ? null : (
    <SidebarContainer showSidebar={showSidebar}>
      {props.sidebar}
    </SidebarContainer>
  );

  // 是否显示遮罩层
  const showMask =
    isMobile === true && showSidebar === true && !_isNil(sidebarEl);

  const contentMaskEl = showMask ? (
    <ContentDetailMask onClick={handleHideSidebar} />
  ) : null;

  const contentEl = children;

  return (
    <PageContentRoot>
      {sidebarEl}
      <ContentDetail>
        {contentMaskEl}
        {contentEl}
      </ContentDetail>
    </PageContentRoot>
  );
});
PageContent.displayName = 'PageContent';
