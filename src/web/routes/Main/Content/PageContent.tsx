import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useSidebarContext } from '../SidebarContext';
import { TMemo } from '@shared/components/TMemo';
import _isNil from 'lodash/isNil';
import { useIsMobile } from '@web/hooks/useIsMobile';
import { useDrag } from 'react-use-gesture';

const PageContentRoot = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
`;

const ContentDetail = styled.div`
  flex: 1;
  background-color: ${(props) => props.theme.style.contentBackgroundColor};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    width: ${(props) => `calc(100vw - ${props.theme.style.navbarWidth})`};
    min-width: ${(props) => `calc(100vw - ${props.theme.style.navbarWidth})`};
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
  display: flex;
  flex-direction: column;
  flex: none;
`;

interface PageContentProps {
  sidebar?: React.ReactNode;
}

const PageGestureWrapper: React.FC = TMemo((props) => {
  const { setShowSidebar } = useSidebarContext();

  const bind = useDrag(
    (state) => {
      const { swipe } = state;
      const swipeX = swipe[0];
      if (swipeX > 0) {
        setShowSidebar(true);
      } else if (swipeX < 0) {
        setShowSidebar(false);
      }
    },
    {
      axis: 'x',
      swipeDistance: 5,
    }
  );

  return <PageContentRoot {...bind()}>{props.children}</PageContentRoot>;
});
PageGestureWrapper.displayName = 'PageGestureWrapper';

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

  const el = (
    <>
      {sidebarEl}

      <ContentDetail>
        {contentMaskEl}
        {contentEl}
      </ContentDetail>
    </>
  );

  if (isMobile) {
    return <PageGestureWrapper>{el}</PageGestureWrapper>;
  } else {
    return <PageContentRoot>{el}</PageContentRoot>;
  }
});
PageContent.displayName = 'PageContent';
