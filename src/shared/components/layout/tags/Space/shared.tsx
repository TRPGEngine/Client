import React from 'react';
import { TagComponent } from '../type';
import { TMemo } from '@shared/components/TMemo';
import { useLayoutChildren } from '../../hooks/useLayoutChildren';
import { Space } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';

interface TagProps {
  size?: SizeType | number;
  direction?: 'horizontal' | 'vertical';
}
export const TagSpaceShared: TagComponent<TagProps> = TMemo((props) => {
  const children = useLayoutChildren(props);

  return (
    <Space size={props.size} direction={props.direction}>
      {children}
    </Space>
  );
});
TagSpaceShared.displayName = 'TagSpaceShared';
