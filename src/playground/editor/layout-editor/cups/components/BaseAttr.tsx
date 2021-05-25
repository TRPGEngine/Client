import React from 'react';
import { regCup } from '@saucerjs/core';
import { LayoutCol } from '@shared/components/layout/tags/Col/shared';

const CUP_NAME = 'BaseAttr';

regCup({
  name: CUP_NAME,
  displayName: '基本属性容器',
  desc: '配套基本属性的容器, 一般与基础属性容器组合使用',
  type: 'container',
  render({ nodeId, attrs, children }) {
    return (
      <LayoutCol sm={18} xs={24}>
        {children}
      </LayoutCol>
    );
  },
  editor() {
    return <div />;
  },
});
