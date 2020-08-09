import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { MenuOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useSidebarContext } from '../SidebarContext';
import { useIsMobile } from '@web/hooks/useIsMobile';

const Root = styled.div`
  padding: 0;
  margin-bottom: 16px;
  font-size: 26px;
`;

export const MobileNavbarSwitch: React.FC = TMemo(() => {
  const isMobile = useIsMobile();
  const { switchSidebar } = useSidebarContext();

  if (!isMobile) {
    return null;
  }

  // 视为手机
  return (
    <Root>
      <MenuOutlined onClick={switchSidebar} />
    </Root>
  );
});
MobileNavbarSwitch.displayName = 'MobileNavbarSwitch';
