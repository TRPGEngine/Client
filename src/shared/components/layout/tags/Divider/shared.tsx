import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { TagComponent } from '../type';
import { Divider } from 'antd';
import { useLayoutChildren } from '../../hooks/useLayoutChildren';

interface TagProps {
  type?: 'horizontal' | 'vertical';
  orientation?: 'left' | 'right' | 'center';
}

export const TagDividerShared: TagComponent<TagProps> = TMemo((props) => {
  const children = useLayoutChildren(props);

  return (
    <Divider
      type={props.type}
      orientation={props.orientation}
      // eslint-disable-next-line react/no-children-prop
      children={children}
    />
  );
});
TagDividerShared.displayName = 'TagDividerShared';
