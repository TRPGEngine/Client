import React from 'react';
import { regCup } from '@saucerjs/core';
import { TagCurrMaxEdit } from '@shared/components/layout/tags/CurrMax/edit';
import { Space } from 'antd';
import { CommonEditorSettings, InputEditorSettings } from '../shared';

const CUP_NAME = 'CurrMax';

regCup({
  name: CUP_NAME,
  displayName: '当前/最大值',
  desc: '封装了一个常用的当前值与最大值的组件',
  type: 'leaf',
  render({ nodeId, attrs, children }) {
    return (
      <TagCurrMaxEdit
        key={nodeId}
        {...attrs}
        _name={CUP_NAME}
        _childrenEl={[]}
        name={attrs['name'] || nodeId}
      />
    );
  },
  editor() {
    return (
      <Space direction="vertical">
        <CommonEditorSettings />

        <InputEditorSettings />
      </Space>
    );
  },
});
