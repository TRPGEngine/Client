import React from 'react';
import { regCup } from '@saucerjs/core';
import { TagBaseInfoEdit } from '@shared/components/layout/tags/BaseInfo/edit';

const CUP_NAME = 'BaseInfo';

regCup({
  name: CUP_NAME,
  displayName: '基本属性',
  desc: '内置了一个模板所需要的所有元素',
  type: 'leaf',
  render({ nodeId, attrs, children }) {
    return (
      <TagBaseInfoEdit
        key={nodeId}
        {...attrs}
        _name={CUP_NAME}
        _childrenEl={[]}
      />
    );
  },
  editor() {
    return <div />;
  },
});
