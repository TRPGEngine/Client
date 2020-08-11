import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { Menu } from 'antd';

const SettingContainer = styled.div`
  width: 80%;
  height: 80%;
`;

export const SettingView: React.FC = TMemo(() => {
  return (
    <SettingContainer>
      <Menu mode="vertical">
        <Menu.Item>设置</Menu.Item>
        <Menu.Item danger={true}>退出登录</Menu.Item>
      </Menu>
    </SettingContainer>
  );
});
SettingView.displayName = 'SettingView';
