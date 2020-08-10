import React, { useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Menu, Popover } from 'antd';
import { Iconfont } from '@web/components/Iconfont';
import { FullModal } from '@web/components/FullModal';

export const MoreAction: React.FC = TMemo((props) => {
  const [visible, setVisible] = useState(false);

  const setting = (
    <Menu mode="vertical">
      <Menu.Item>设置</Menu.Item>
      <Menu.Item danger={true}>退出登录</Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Iconfont onClick={() => setVisible(true)}>&#xe625;</Iconfont>

      <FullModal visible={visible} onChangeVisible={setVisible}>
        {setting}
      </FullModal>
    </div>
  );
});
MoreAction.displayName = 'MoreAction';
