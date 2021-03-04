import { regCup } from '@saucerjs/core';
import { TagInputNumberEdit } from '@shared/components/layout/tags/InputNumber/edit';
import { Space } from 'antd';
import React from 'react';
import { CommonEditorEditor, InputEditorEditor } from '../shared';

regCup({
  name: 'InputNumber',
  displayName: '数字输入框',
  desc: '标准数字输入框',
  type: 'leaf',
  render({ nodeId, attrs }) {
    return (
      <TagInputNumberEdit
        key={nodeId}
        _name={'Input'}
        _childrenEl={[]}
        name={attrs['name'] || nodeId}
        {...attrs}
      />
    );
  },
  editor() {
    return (
      <Space direction="vertical">
        <CommonEditorEditor />

        <InputEditorEditor />
      </Space>
    );
  },
});
