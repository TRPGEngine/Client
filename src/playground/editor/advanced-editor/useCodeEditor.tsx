import React, { useMemo, useCallback, useRef } from 'react';
import _debounce from 'lodash/debounce';
import { useLocalStorage } from 'react-use';
import { IPosition, KeyMod, KeyCode, editor } from 'monaco-editor';
import MonacoEditor, { EditorDidMount } from 'react-monaco-editor';
import { message } from 'antd';
import copy from 'copy-to-clipboard';
import { initCode } from './example';
import { CODE_STORE_KEY } from '../../helper';

const initCodePos: IPosition = {
  lineNumber: 3,
  column: 21,
};

const editorOptions = {
  selectOnLineNumbers: true,
  automaticLayout: true,
};

/**
 * 代码编辑器
 */
export function useCodeEditor() {
  const [code = '', setCode] = useLocalStorage(CODE_STORE_KEY, initCode);
  const editorRef = useRef<editor.IStandaloneCodeEditor>();

  const handleEditorChange = useMemo(
    () =>
      _debounce((newValue: string) => {
        setCode(newValue);
      }, 500),
    [setCode]
  );

  const onEditorDidMount: EditorDidMount = useCallback((editorIns) => {
    editorRef.current = editorIns;
    editorIns.focus();
    editorIns.setPosition(initCodePos);

    // tslint:disable-next-line: no-bitwise
    editorIns.addCommand(KeyMod.CtrlCmd | KeyCode.KEY_S, (e) => {
      copy(code) && message.success('布局代码已复制到剪切板');
    });
  }, []);

  const codeEditorEl = useMemo(() => {
    return (
      <MonacoEditor
        language="xml"
        theme="vs-dark"
        value={code}
        options={editorOptions}
        onChange={handleEditorChange}
        editorDidMount={onEditorDidMount}
      />
    );
  }, [code, editorOptions, handleEditorChange, onEditorDidMount]);

  return {
    code,
    setCode,
    codeEditorEl,
  };
}
