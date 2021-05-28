import React from 'react';
import { regCup } from '@saucerjs/core';
import { TagDividerShared } from '@shared/components/layout/tags/Divider/shared';

const CUP_NAME = 'Divider';

regCup({
  name: CUP_NAME,
  displayName: '分割线',
  desc: '一条分割线',
  type: 'leaf',
  render({ nodeId, attrs, children }) {
    return (
      <TagDividerShared
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
