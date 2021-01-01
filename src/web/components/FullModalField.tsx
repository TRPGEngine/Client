import React, { Fragment, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import { TMemo } from '@shared/components/TMemo';
import { Button, Input, Space } from 'antd';
import { EditOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';

export type FullModalFieldEditorRenderComponent = React.FC<{
  value: string;
  onChange: (val: string) => void;
}>;

interface FullModalFieldProps {
  /**
   * 字段标题
   */
  title: React.ReactNode;

  /**
   * 字段内容
   * 如果没有则向下取value的值
   */
  content?: React.ReactNode;

  /**
   * 是否可编辑
   */
  editable?: boolean;

  /**
   * 如果可编辑则必填
   * 用于告知组件当前的值
   */
  value?: string;

  /**
   * 渲染编辑视图的编辑器
   */
  renderEditor?: FullModalFieldEditorRenderComponent;

  /**
   * 编辑完成后的回调
   */
  onSave?: (val: string) => void;
}

const FieldContainer = styled.div`
  margin-bottom: 16px;
`;

const FieldTitle = styled.div`
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.color.channelsDefault};
  margin-bottom: 8px;
`;

const FieldValue = styled.div`
  line-height: 40px;
  font-size: 16px;
  ${(props) => props.theme.mixins.oneline};
`;

const FullModalFieldEditorRoot = styled(Space)`
  display: flex;
  width: 100%;
  align-items: flex-end !important;
`;

/**
 * 字段编辑器
 */
const FullModalFieldEditor: React.FC<FullModalFieldProps> = TMemo((props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState(props.value ?? '');

  useEffect(() => {
    setEditingValue(props.value ?? '');
  }, [props.value]);

  const handleEditing = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  const handleSave = useCallback(() => {
    props.onSave?.(editingValue);
    setIsEditing(false);
  }, [props.onSave, editingValue]);

  const EditorComponent = props.renderEditor;

  return (
    <FullModalFieldEditorRoot>
      {isEditing && !_isNil(EditorComponent) ? (
        <EditorComponent value={editingValue} onChange={setEditingValue} />
      ) : (
        <span>{props.content ?? props.value}</span>
      )}

      <Button
        icon={isEditing ? <CloseOutlined /> : <EditOutlined />}
        onClick={handleEditing}
      />

      {isEditing && (
        <Button type="primary" icon={<CheckOutlined />} onClick={handleSave} />
      )}
    </FullModalFieldEditorRoot>
  );
});
FullModalFieldEditor.displayName = 'FullModalFieldEditor';

export const FullModalField: React.FC<FullModalFieldProps> = TMemo((props) => {
  const valueTitle = _isString(props.value) ? props.value : undefined;

  const allowEditor = props.editable === true && !_isNil(props.renderEditor);

  return (
    <FieldContainer>
      <FieldTitle>{props.title}</FieldTitle>
      <FieldValue title={valueTitle}>
        {allowEditor === true ? (
          <FullModalFieldEditor {...props} />
        ) : (
          <span>{props.content ?? props.value}</span>
        )}
      </FieldValue>
    </FieldContainer>
  );
});
FullModalField.displayName = 'FullModalField';

/**
 * 默认的输入框字段编辑器
 */
export const DefaultFullModalInputEditorRender: FullModalFieldEditorRenderComponent = ({
  value,
  onChange,
}) => <Input value={value} onChange={(e) => onChange(e.target.value)} />;

/**
 * 默认的多行输入框字段编辑器
 */
export const DefaultFullModalTextAreaEditorRender: FullModalFieldEditorRenderComponent = ({
  value,
  onChange,
}) => (
  <Input.TextArea
    rows={4}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);
