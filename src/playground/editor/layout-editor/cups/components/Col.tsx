import React from 'react';
import { regCup } from '@saucerjs/core';
import { Space } from 'antd';
import { LayoutCol } from '@shared/components/layout/tags/Col/shared';

const CUP_NAME = 'Col';

regCup({
  name: CUP_NAME,
  displayName: '列',
  desc: '列容器',
  type: 'container',
  render({ nodeId, attrs, children }) {
    return (
      <LayoutCol
        key={nodeId}
        {...attrs}
        style={{ minWidth: 100, ...attrs.style }}
      >
        {children}
      </LayoutCol>
    );
  },
  editor() {
    return <Space direction="vertical">{/*  */}</Space>;
  },
});
