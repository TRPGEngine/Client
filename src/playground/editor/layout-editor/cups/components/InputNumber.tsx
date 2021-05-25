import { regCup } from '@saucerjs/core';
import { TagInputNumberEdit } from '@shared/components/layout/tags/InputNumber/edit';
import { Space } from 'antd';
import React from 'react';
import { CommonEditorSettings, InputEditorSettings } from '../shared';

const CUP_NAME = 'InputNumber';

regCup({
  name: CUP_NAME,
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
