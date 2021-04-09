import React from 'react';
import { regCup } from '@saucerjs/core';
import { Checkbox, InputNumber, Space } from 'antd';
import { CommonEditorSettings, CupEditorWrapper } from '../shared';
import { TagTextAreaEdit } from '@shared/components/layout/tags/TextArea/edit';
import { useTeaAttrsContext } from '@saucerjs/editor';

regCup({
  name: 'TextArea',
  displayName: '多行文本',
  desc: '多行文本输入',
  type: 'leaf',
  defaultAttrs: ({ nodeId }) => ({
    name: nodeId,
  }),
  render({ nodeId, attrs }) {
    return (
      <TagTextAreaEdit
        key={nodeId}
        _name={'TextArea'}
        _childrenEl={[]}
        name={attrs['name'] || nodeId}
        {...attrs}
      />
    );
  },
  editor() {
    const { currentTeaAttrs, setCurrentTeaAttrs } = useTeaAttrsContext();

    return (
      <Space direction="vertical">
        <CommonEditorSettings />

        <CupEditorWrapper title="自动设置大小">
          <Checkbox
            checked={currentTeaAttrs['autosize'] || false}
            onChange={(e) =>
              setCurrentTeaAttrs({
                autosize: e.target.checked,
              })
            }
          />
        </CupEditorWrapper>

        <CupEditorWrapper title="行数">
          <InputNumber
            disabled={currentTeaAttrs['autosize'] === true}
            value={currentTeaAttrs['rows']}
            onChange={(value) =>
              setCurrentTeaAttrs({
                rows: value,
              })
            }
          />
        </CupEditorWrapper>
      </Space>
    );
  },
});
