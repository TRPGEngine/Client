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
import XMLBuilder, {
  XMLBuilderState,
  LayoutType,
} from '@shared/components/layout/XMLBuilder';
import ReactJson from 'react-json-view';
import copy from 'copy-to-clipboard';
import { Block } from './components/Block';
import { Select, message, Button, Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
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
  const [layoutType, setLayoutType] = useState<LayoutType>('edit');
  const editorRef = useRef<editor.IStandaloneCodeEditor>();

  const onEditorDidMount: EditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
    editor.setPosition(initCodePos);

    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KEY_S, (e) => {
      copy(code) && message.success('布局代码已复制到剪切板');
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

  const handleChangeLayoutType = useCallback((e: CheckboxChangeEvent) => {
    setLayoutType(e.target.checked ? 'edit' : 'detail');
  }, []);
  const RenderActions = useMemo(() => {
    return (
      <div
        style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}
      >
        <div>
          <Checkbox
            style={{ width: 200 }}
            checked={layoutType === 'edit'}
            onChange={handleChangeLayoutType}
          >
            编辑模式
          </Checkbox>
        </div>
        <Button type="primary">分享给用户</Button>
      </div>
    );
  }, [layoutType]);

  const [currentState, setCurrentState] = useState({});
  const handleStateChange = useCallback((newState: XMLBuilderState) => {
    setCurrentState({ ...newState.data });
  }, []);

  return (
    <Container>
      <SplitPane split="vertical" defaultSize="50%">
        <Block label="布局" theme="dark" actions={LayoutActions}>
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
        <SplitPane split="horizontal" defaultSize="80%">
          <Block label="" theme="light" actions={RenderActions}>
            <div style={{ width: '100%' }}>
              <XMLBuilder
                layoutType={layoutType}
                xml={code}
                onChange={handleStateChange}
              />
            </div>
          </Block>
          <div>
            <ReactJson
              name={false}
              style={{ fontFamily: 'inherit' }}
              src={currentState}
              enableClipboard={false}
              displayObjectSize={false}
              displayDataTypes={false}
            />
          </div>
        </SplitPane>
      </SplitPane>
    </Container>
  );
});

export default ActorEditor;
