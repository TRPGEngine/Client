import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Menu } from 'antd';

interface GroupMenuProps {
  groupUUID: string;
}
export const GroupMenu: React.FC<GroupMenuProps> = TMemo((props) => {
  const { groupUUID } = props;

  return (
    <Menu>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.alipay.com/"
        >
          查看详情
        </a>
      </Menu.Item>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.taobao.com/"
        >
          邀请成员
        </a>
      </Menu.Item>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.tmall.com/"
        >
          创建面板
        </a>
      </Menu.Item>
      <Menu.Item danger={true}>退出团</Menu.Item>
    </Menu>
  );
});
GroupMenu.displayName = 'GroupMenu';
