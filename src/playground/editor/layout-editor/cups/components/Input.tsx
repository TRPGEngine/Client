import React from 'react';
import { regCup, useCurrentTeaId } from '@saucerjs/core';
import { TagInputEdit } from '@shared/components/layout/tags/Input/edit';
import { useTeaAttrsContext } from '@saucerjs/editor';
import { Checkbox, Input, Space } from 'antd';
import { CupEditorWrapper } from '../shared';

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
    const { currentTeaAttrs, setCurrentTeaAttrs } = useTeaAttrsContext();
    const currentTeaId = useCurrentTeaId();

    return (
      <Space direction="vertical">
        <CupEditorWrapper
          title="组件名"
          desc="组件名必须全局唯一, 会影响用户输入的数据的命名"
        >
          <Input
            value={
              currentTeaAttrs['name'] !== currentTeaId
                ? currentTeaAttrs['name']
                : undefined
            }
            placeholder={currentTeaId ?? undefined}
            onChange={(e) =>
              setCurrentTeaAttrs({
                name: e.target.value || currentTeaId,
              })
            }
          />
        </CupEditorWrapper>

        <CupEditorWrapper title="标签名">
          <Input
            value={currentTeaAttrs['label']}
            onChange={(e) =>
              setCurrentTeaAttrs({
                label: e.target.value || undefined,
              })
            }
          />
        </CupEditorWrapper>

        <CupEditorWrapper title="占位符">
          <Input
            value={currentTeaAttrs['placeholder']}
            onChange={(e) =>
              setCurrentTeaAttrs({
                placeholder: e.target.value || undefined,
              })
            }
          />
        </CupEditorWrapper>

        <CupEditorWrapper title="行内模式">
          <Checkbox
            checked={currentTeaAttrs['inline'] || false}
            onChange={(e) =>
              setCurrentTeaAttrs({
                inline: e.target.checked || undefined,
              })
            }
          />
        </CupEditorWrapper>

        <CupEditorWrapper title="隐藏标签">
          <Checkbox
            checked={currentTeaAttrs['hideLabel'] || false}
            onChange={(e) =>
              setCurrentTeaAttrs({
                hideLabel: e.target.checked || undefined,
              })
            }
          />
        </CupEditorWrapper>
      </Space>
    );
  },
});
