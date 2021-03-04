import React from 'react';
import { regCup } from '@saucerjs/core';
import { Space } from 'antd';
import { CommonEditorEditor, InputEditorEditor } from '../shared';
import { TagInputEdit } from '@shared/components/layout/tags/Input/edit';

regCup({
  name: 'Input',
  displayName: '输入框',
  desc: '标准输入框',
  type: 'leaf',
  render({ nodeId, attrs }) {
    return (
      <TagInputEdit
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
