import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  ReactElement,
  useEffect,
} from 'react';
import styled from 'styled-components';
import SplitPane from 'react-split-pane';
import MonacoEditor, { EditorDidMount } from 'react-monaco-editor';
import './split-pane.css';
import { editor, IPosition, KeyMod, KeyCode } from 'monaco-editor';
import { useLocalStorage } from 'react-use';
import XMLBuilder, {
  XMLBuilderState,
  LayoutType,
} from '@shared/components/layout/XMLBuilder';
import ReactJson from 'react-json-view';
import copy from 'copy-to-clipboard';
import LZString from 'lz-string';
import { Block } from './components/Block';
import { Select, message, Button, Checkbox, Col, Tooltip } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { registerLayoutCodeSuggest } from './editor/suggestions';
import config from '@shared/project.config';
const { Option } = Select;

declare module 'antd/lib/select' {
  export interface OptionProps {
    [other: string]: any;
  }
}

registerLayoutCodeSuggest(); // 注册布局相关的代码提示

/**
 * 示例代码
 */
const exampleLayout = [
  { label: 'Simple', value: require('./example/simple.xml').default },
  { label: 'Grid', value: require('./example/grid.xml').default },
  { label: 'Input', value: require('./example/input.xml').default },
  { label: 'Tabs', value: require('./example/tabs.xml').default },
  { label: 'Display', value: require('./example/display.xml').default },
  {
    label: 'Use and Define',
    value: require('./example/use-define.xml').default,
  },
  {
    label: 'Var',
    value: require('./example/var.xml').default,
  },
];
if (config.environment === 'development') {
  exampleLayout.push({
    label: 'CoC7',
    value: require('./example/coc7.xml').default,
  });
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: white;
`;

const XMLRenderContainer = styled.div<{ isMobile: boolean }>`
  ${(props) =>
    props.isMobile
      ? `
        width: 375px;
        height: 667px;
        margin: 20px auto;
        border: 1px solid #ccc;
        overflow: auto;
        box-sizing: content-box;
      `
      : `width: 100%`}
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
  const [code, setCode] = useLocalStorage('playground:code', initCode);
  const [layoutType, setLayoutType] = useState<LayoutType>('edit'); // 渲染类型
  const [isMobile, setIsMobile] = useState(false); // 是否为移动模式
  const editorRef = useRef<editor.IStandaloneCodeEditor>();

  useEffect(() => {
    // 尝试载入url中的code
    const hash = window.location.hash;
    if (hash.startsWith('#code')) {
      const codehash = hash.split('/')[1] ?? '';
      setCode(LZString.decompressFromEncodedURIComponent(codehash));
    }
  }, []);

  const onEditorDidMount: EditorDidMount = useCallback((editor) => {
    editorRef.current = editor;
    editor.focus();
    editor.setPosition(initCodePos);

    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KEY_S, (e) => {
      copy(code) && message.success('布局代码已复制到剪切板');
    });
  }, []);

  const handleSelectLayout = useCallback(
    (value: string, option: ReactElement) => {
      const xml = option.props.xml;

      setCode(xml);
    },
    []
  );
  const handleResetCode = useCallback(() => {
    setCode(initCode);
  }, []);
  const LayoutActions = useMemo(() => {
    return (
      <div style={{ display: 'flex' }}>
        <Select
          style={{ width: 200, marginRight: 6 }}
          placeholder="请选择布局"
          onChange={handleSelectLayout}
        >
          {exampleLayout.map((l) => (
            <Option key={l.label} value={l.label} xml={l.value}>
              {l.label}
            </Option>
          ))}
        </Select>
        <Button onClick={handleResetCode}>重置</Button>
      </div>
    );
  }, []);

  const handleChangeLayoutType = useCallback((e: CheckboxChangeEvent) => {
    setLayoutType(e.target.checked ? 'edit' : 'detail');
  }, []);
  const handleChangeIsMobile = useCallback((e: CheckboxChangeEvent) => {
    setIsMobile(e.target.checked ? true : false);
  }, []);
  const handleShareCode = useCallback(() => {
    const codehash = LZString.compressToEncodedURIComponent(code);
    const hash = `code/${codehash}`;
    const { origin, pathname } = window.location;

    copy(`${origin}${pathname}#${hash}`) &&
      message.success('分享链接已复制到剪切板');
  }, []);
  const [renderKey, setRenderKey] = useState(0);
  const handleForceUpdate = useCallback(() => {
    setRenderKey(renderKey + 1);
  }, [renderKey]);
  const RenderActions = useMemo(() => {
    return (
      <div
        style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}
      >
        <div>
          <Checkbox
            checked={layoutType === 'edit'}
            onChange={handleChangeLayoutType}
          >
            编辑模式
          </Checkbox>
          <Checkbox checked={isMobile} onChange={handleChangeIsMobile}>
            移动页面
          </Checkbox>
        </div>
        <div style={{ display: 'flex' }}>
          <Tooltip title="强制刷新布局">
            <Button
              type="primary"
              onClick={handleForceUpdate}
              icon="sync"
              style={{ marginRight: 4 }}
            />
          </Tooltip>
          <Tooltip title="分享给用户">
            <Button type="primary" onClick={handleShareCode}>
              分享给用户
            </Button>
          </Tooltip>
        </div>
      </div>
    );
  }, [
    layoutType,
    isMobile,
    handleChangeIsMobile,
    handleForceUpdate,
    handleShareCode,
  ]);

  const [currentData, setCurrentData] = useState({});
  const [currentGlobal, setCurrentGlobal] = useState({});
  const handleStateChange = useCallback((newState: XMLBuilderState) => {
    setCurrentData({ ...newState.data });
    setCurrentGlobal({ ...newState.global });
  }, []);

  const handleEditorChange = useCallback((newValue: string) => {
    setCode(newValue);
  }, []);

  return (
    <Container>
      <SplitPane split="vertical" defaultSize="50%">
        <Block label="布局" theme="dark" actions={LayoutActions}>
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#1e1e1e',
            }}
          >
            <MonacoEditor
              language="xml"
              theme="vs-dark"
              value={code}
              options={editorOptions}
              onChange={handleEditorChange}
              editorDidMount={onEditorDidMount}
            />
          </div>
        </Block>
        <SplitPane split="horizontal" defaultSize="80%">
          <Block label="" theme="light" actions={RenderActions}>
            <XMLRenderContainer isMobile={isMobile}>
              <XMLBuilder
                key={renderKey}
                layoutType={layoutType}
                xml={code}
                onChange={handleStateChange}
              />
            </XMLRenderContainer>
          </Block>
          <SplitPane split="vertical" defaultSize="80%">
            <div>
              <ReactJson
                name={false}
                style={{ fontFamily: 'inherit' }}
                src={currentData}
                enableClipboard={false}
                displayObjectSize={false}
                displayDataTypes={false}
              />
            </div>
            <div>
              <ReactJson
                name={false}
                style={{ fontFamily: 'inherit' }}
                src={currentGlobal}
                enableClipboard={false}
                displayObjectSize={false}
                displayDataTypes={false}
              />
            </div>
          </SplitPane>
        </SplitPane>
      </SplitPane>
    </Container>
  );
});

export default ActorEditor;
