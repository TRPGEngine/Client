import React from 'react';
import { regCup } from '@saucerjs/core';
import { Input, Space } from 'antd';
import { CommonEditorSettings, CupEditorWrapper } from '../shared';
import { TagTipShared } from '@shared/components/layout/tags/Tip/shared';
import { useTeaAttrsContext } from '@saucerjs/editor';

regCup({
  name: 'Tip',
  displayName: '提示',
  desc: '一个提示的问号, 鼠标移动上去会弹出内容, 常用于注释说明',
  type: 'leaf',
  render({ nodeId, attrs }) {
    return (
      <TagTipShared
        key={nodeId}
        _name={'Tip'}
        _childrenEl={[
          {
            text: attrs._childrenText,
          },
        ]}
        {...attrs}
      />
    );
  },
  editor() {
    const { currentTeaAttrs, setCurrentTeaAttrs } = useTeaAttrsContext();

    return (
      <Space direction="vertical">
        <CommonEditorSettings hasLabel={false} />

        <CupEditorWrapper title="描述信息">
          <Input.TextArea
            value={currentTeaAttrs['_childrenText']}
            onChange={(e) =>
              setCurrentTeaAttrs({
                _childrenText: e.target.value || undefined,
              })
            }
          />
        </CupEditorWrapper>
      </Space>
    );
  },
});
