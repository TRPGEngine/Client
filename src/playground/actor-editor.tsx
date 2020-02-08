import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import SplitPane from 'react-split-pane';
import MonacoEditor, { EditorDidMount } from 'react-monaco-editor';
import './split-pane.css';
import { editor, IPosition, KeyMod, KeyCode } from 'monaco-editor';
import XMLBuilder from '@shared/components/layout/XMLBuilder';

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: white;
`;

const Block = styled.div<{ label: string }>`
  height: 100%;
  width: 100%;
  overflow: hidden;

  &:before {
    content: '${(props) => props.label || ''}';
    padding: 0.5rem 2rem;
    background-color: #333;
    display: block;
    color: white;
    font-size: 16px;
    border-bottom: 1px solid #111;
  }
`;

const editorOptions = {
  selectOnLineNumbers: true,
  automaticLayout: true,
};

const initCode = `<?xml version="1.0" encoding="utf-8" ?>
<Template>
  <!-- 在此处输入你的布局 -->

</Template>
`;
const initCodePos: IPosition = {
  lineNumber: 3,
  column: 21,
};

const ActorEditor = React.memo(() => {
  const [code, setCode] = useState<string>(initCode);
  const editorRef = useRef<editor.IStandaloneCodeEditor>();

  const onEditorDidMount: EditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
    editor.setPosition(initCodePos);
    console.log(KeyMod.CtrlCmd, KeyCode.KEY_S, KeyMod.CtrlCmd | KeyCode.KEY_S);
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KEY_S, () => {
      console.log('TODO: save');
    });
  };

  return (
    <Container>
      <SplitPane split="vertical" defaultSize="50%">
        <Block label="布局">
          <MonacoEditor
            width="100%"
            height="100%"
            language="xml"
            theme="vs-dark"
            value={code}
            options={editorOptions}
            onChange={(newValue) => setCode(newValue)}
            editorDidMount={onEditorDidMount}
          />
        </Block>
        <SplitPane split="horizontal" defaultSize="60%">
          <div>
            <XMLBuilder xml={code} />
          </div>

          <div>这里是属性, 需要一个JSON显示器</div>
        </SplitPane>
      </SplitPane>
    </Container>
  );
});

export default ActorEditor;
