import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  ReactElement,
} from 'react';
import styled from 'styled-components';
import SplitPane from 'react-split-pane';
import MonacoEditor, { EditorDidMount } from 'react-monaco-editor';
import './split-pane.css';
import { editor, IPosition, KeyMod, KeyCode } from 'monaco-editor';
import XMLBuilder from '@shared/components/layout/XMLBuilder';
import { Block } from './components/Block';
import { Select } from 'antd';
const { Option } = Select;

declare module 'antd/lib/select' {
  export interface OptionProps {
    [other: string]: any;
  }
}

/**
 * 示例代码
 */
const exampleLayout = [
  { label: 'simple', value: require('./example/simple.xml').default },
];

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: white;
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

  const handleSelectLayout = useCallback(
    (value: string, option: ReactElement) => {
      const xml = option.props.xml;

      setCode(xml);
    },
    []
  );

  const LayoutActions = useMemo(() => {
    return (
      <div>
        <Select
          style={{ width: 120 }}
          placeholder="请选择布局"
          onChange={handleSelectLayout}
        >
          {exampleLayout.map((l) => (
            <Option value={l.label} xml={l.value}>
              {l.label}
            </Option>
          ))}
        </Select>
      </div>
    );
  }, []);

  return (
    <Container>
      <SplitPane split="vertical" defaultSize="50%">
        <Block label="布局" actions={LayoutActions}>
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
          <div style={{ width: '100%' }}>
            <XMLBuilder xml={code} />
          </div>

          <div>这里是属性, 需要一个JSON显示器</div>
        </SplitPane>
      </SplitPane>
    </Container>
  );
});

export default ActorEditor;
