import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Checkbox, Input, Select, Space, Typography } from 'antd';
import _isString from 'lodash/isString';
import { TipIcon } from '@web/components/TipIcon';
import { useCurrentTeaId } from '@saucerjs/core';
import { buildEditorFields, useTeaAttrsContext } from '@saucerjs/editor';
import type { OptionData, OptionGroupData } from 'rc-select/es/interface';

export const InputEditorField = buildEditorFields(
  'Input',
  ({ label, field, currentTeaAttrs, setCurrentTeaAttrs }) => {
    return (
      <Input
        placeholder={label}
        value={currentTeaAttrs[field]}
        onChange={(e) =>
          setCurrentTeaAttrs({
            [field]: e.target.value,
          })
        }
      />
    );
  }
);

export const SelectEditorField = buildEditorFields<{
  options: (OptionData | OptionGroupData)[];
}>(
  'Select',
  ({ label, field, currentTeaAttrs, setCurrentTeaAttrs, options }) => {
    return (
      <Select
        placeholder={label}
        value={currentTeaAttrs[field]}
        onChange={(value) =>
          setCurrentTeaAttrs({
            [field]: value,
          })
        }
        options={options}
      />
    );
  }
);

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
export const CommonEditorSettings: React.FC<{
  hasLabel?: boolean;
}> = TMemo((props) => {
  const { currentTeaAttrs, setCurrentTeaAttrs } = useTeaAttrsContext();
  const currentTeaId = useCurrentTeaId();
  const { hasLabel = true } = props;

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

      {hasLabel === true && (
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
      )}
    </>
  );
});
CommonEditorSettings.displayName = 'CommonEditorSettings';

/**
 * 通用输入组件的编辑组件
 */
export const InputEditorSettings: React.FC = TMemo(() => {
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
InputEditorSettings.displayName = 'InputEditorSettings';
