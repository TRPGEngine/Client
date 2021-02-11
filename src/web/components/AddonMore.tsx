import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import type { DropDownProps } from 'antd/lib/dropdown';

export interface AddonMoreItem {
  label: string;
  onClick: () => void;
}

interface AddonMoreProps extends Partial<DropDownProps> {
  items: AddonMoreItem[];
}
export const AddonMore: React.FC<AddonMoreProps> = TMemo((props) => {
  const { items, ...dropDownProps } = props;

  const menu = (
    <Menu>
      {items.map((item) => (
        <Menu.Item key={item.label} onClick={item.onClick}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} {...dropDownProps}>
      <MoreOutlined />
    </Dropdown>
  );
});
AddonMore.displayName = 'AddonMore';
