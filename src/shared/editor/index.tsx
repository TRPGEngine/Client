import React, { useCallback } from 'react';
import type { Quill, Delta, Sources, DeltaStatic } from 'quill';
// 等 https://github.com/zenoamaro/react-quill/pull/549 这个pr过了以后看一下能不能把quill的类型搞到react-quill里
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import TLoadable from '@web/components/TLoadable';
import _isFunction from 'lodash/isFunction';
import { TMemo } from '@shared/components/TMemo';

const ReactQuill = TLoadable(() => import('react-quill'));

const Editor = styled(ReactQuill).attrs((props) => ({
  theme: 'snow',
}))`
  height: 100%;
  display: flex;
  flex-direction: column;

  .ql-toolbar {
    text-align: left;
  }
`;

interface Props {
  defaultValue?: string | Delta;
  value?: string | Delta;
  onChange?: (content: string) => void;
  style?: React.CSSProperties;
}

export const TRPGEditor: React.FC<Props> = TMemo((props) => {
  const { defaultValue, value, onChange, style } = props;
  const handleChange = useCallback(
    (content: string, delta: Delta, source: Sources, editor) => {
      _isFunction(onChange) && onChange(content);
    },
    [onChange]
  );

  return (
    <Editor
      defaultValue={defaultValue}
      value={value}
      onChange={handleChange}
      style={style}
    />
  );
});
TRPGEditor.displayName = 'TRPGEditor';

export default TRPGEditor;
