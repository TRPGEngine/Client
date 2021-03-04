import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Checkbox, Input, Space, Typography } from 'antd';
import _isString from 'lodash/isString';
import { TipIcon } from '@web/components/TipIcon';
import { useCurrentTeaId } from '@saucerjs/core';
import { useTeaAttrsContext } from '@saucerjs/editor';

export const CupEditorWrapper: React.FC<{
  title: string;
  desc?: string;
}> = TMemo((props) => {
  const { title, desc } = props;

  return (
    <div>
      <Space>
        <Typography.Text>{title}</Typography.Text>

        {_isString(desc) && <TipIcon desc={desc} />}
      </Space>

      <div>{props.children}</div>
    </div>
  );
});
CupEditorWrapper.displayName = 'CupEditorWrapper';

/**
 * 通用组件编辑设置
 */
export const CommonEditorEditor: React.FC = TMemo(() => {
  const { currentTeaAttrs, setCurrentTeaAttrs } = useTeaAttrsContext();
  const currentTeaId = useCurrentTeaId();

  return (
    <>
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
    </>
  );
});

/**
 * 通用输入组件的编辑组件
 */
export const InputEditorEditor: React.FC = TMemo(() => {
  const { currentTeaAttrs, setCurrentTeaAttrs } = useTeaAttrsContext();

  return (
    <>
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
    </>
  );
});
InputEditorEditor.displayName = 'InputEditorEditor';
