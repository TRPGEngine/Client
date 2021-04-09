import { regCup } from '@saucerjs/core';
import { TagInputNumberEdit } from '@shared/components/layout/tags/InputNumber/edit';
import { Space } from 'antd';
import React from 'react';
import { CommonEditorSettings, InputEditorSettings } from '../shared';

regCup({
  name: 'InputNumber',
  displayName: '数字输入框',
  desc: '标准数字输入框',
  type: 'leaf',
  defaultAttrs: ({ nodeId }) => ({
    name: nodeId,
  }),
  render({ nodeId, attrs }) {
    return (
      <TagInputNumberEdit
        key={nodeId}
        _name={'InputNumber'}
        _childrenEl={[]}
        name={attrs['name'] || nodeId}
        {...attrs}
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
