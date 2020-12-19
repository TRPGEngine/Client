import React, { useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { MenuOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useSidebarContext } from '../SidebarContext';
import { ShowInMobile } from '@web/components/ShowInMobile';

const Root = styled.div`
  padding: 0;
  margin-bottom: 16px;
  font-size: 26px;
`;

const MobileNavbarSwitchButton: React.FC = TMemo(() => {
  const { switchSidebar, setShowSidebar } = useSidebarContext();

  useEffect(() => {
    // 当按钮出现时强制移除侧边栏
    setShowSidebar(false);

    return () => {
      // 当按钮隐藏时强制显示侧边栏
      setShowSidebar(true);
    };
  }, []);

  return (
    <Root>
      <MenuOutlined onClick={switchSidebar} />
    </Root>
  );
});
MobileNavbarSwitchButton.displayName = 'MobileNavbarSwitchButton';

export const MobileNavbarSwitch: React.FC = TMemo(() => {
  // 视为手机 显示切换按钮
  return (
    <ShowInMobile>
      <MobileNavbarSwitchButton />
    </ShowInMobile>
  );
});
MobileNavbarSwitch.displayName = 'MobileNavbarSwitch';
