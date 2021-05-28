import React from 'react';
import { regCup } from '@saucerjs/core';
import { Space } from 'antd';
import { CommonEditorSettings, InputEditorSettings } from '../shared';
import { TagInputEdit } from '@shared/components/layout/tags/Input/edit';

const CUP_NAME = 'Input';

regCup({
  name: CUP_NAME,
  displayName: '输入框',
  desc: '标准输入框',
  type: 'leaf',
  defaultAttrs: ({ nodeId }) => ({
    name: nodeId,
  }),
  render({ nodeId, attrs }) {
    return (
      <TagInputEdit
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
