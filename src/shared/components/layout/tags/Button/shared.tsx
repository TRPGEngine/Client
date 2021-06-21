import React, { useContext } from 'react';
import type { TagComponent } from '../type';
import { TMemo } from '@shared/components/TMemo';
import { Button, ButtonProps } from 'antd';
import { useLayoutChildren } from '../../hooks/useLayoutChildren';
import { LayoutStateContext } from '../../context/LayoutStateContext';

interface TagButtonSharedProps {
  showInDetail?: boolean;
  type: ButtonProps['type'];
  danger: ButtonProps['danger'];
  onClick: ButtonProps['onClick'];
}
export const TagButtonShared: TagComponent<TagButtonSharedProps> = TMemo(
  (props) => {
    const { showInDetail = false } = props;
    const children = useLayoutChildren(props);
    const context = useContext(LayoutStateContext)!;

    if (context.layoutType === 'detail' && showInDetail !== true) {
      // 详情页不显示按钮(默认)
      return null;
    }

    return (
      <Button type={props.type} danger={props.danger} onClick={props.onClick}>
        {children}
      </Button>
    );
  }
);
TagButtonShared.displayName = 'TagButtonShared';
