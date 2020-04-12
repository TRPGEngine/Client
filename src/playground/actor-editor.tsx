import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  ReactElement,
  useEffect,
} from 'react';
import styled from 'styled-components';
import MonacoEditor, { EditorDidMount } from 'react-monaco-editor';
import { editor, IPosition, KeyMod, KeyCode } from 'monaco-editor';
import { useLocalStorage, useCounter } from 'react-use';
import XMLBuilder, {
  XMLBuilderState,
  LayoutType,
} from '@shared/components/layout/XMLBuilder';
import ReactJson from 'react-json-view';
import copy from 'copy-to-clipboard';
import LZString from 'lz-string';
import { Block } from './components/Block';
import _isNil from 'lodash/isNil';
import _find from 'lodash/find';
import _debounce from 'lodash/debounce';
import { SyncOutlined } from '@ant-design/icons';
import { Select, message, Button, Checkbox, Tooltip } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { registerLayoutCodeSuggest } from './editor/suggestions';
import { exampleLayout, workingLabel } from './editor/example';
import config from '@shared/project.config';
import SplitPane from '@shared/components/web/SplitPane';

const { Option } = Select;

declare module 'antd/lib/select' {
  export interface OptionProps {
    [other: string]: any;
  }
}

registerLayoutCodeSuggest(); // 注册布局相关的代码提示

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

  useEffect(() => {
    if (config.environment === 'development') {
      // 如果是开发模式，则强制加载正在工作的布局
      const workingLayout = _find(exampleLayout, ['label', workingLabel]);
      if (!_isNil(workingLayout)) {
        setCode(workingLayout.value);
        incRenderKey();
      }
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

  const handleSelectLayout = useCallback((value: string, option: any) => {
    const xml = option.props.xml;
    setCode(xml);
  }, []);
  const handleResetCode = useCallback(() => {
    setCode(initCode);
  }, []);
  const LayoutActions = useMemo(() => {
    return (
      <div style={{ display: 'flex' }}>
        <Select
          style={{ width: 200, marginRight: 6 }}
          placeholder="请选择示例"
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
  const [renderKey, { inc: incRenderKey }] = useCounter(0);
  const handleForceUpdate = useCallback(() => {
    incRenderKey();
  }, [incRenderKey]);
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
              icon={<SyncOutlined />}
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

  const handleEditorChange = useMemo(
    () =>
      _debounce((newValue: string) => {
        setCode(newValue);
      }, 500),
    [setCode]
  );

  const codeEditor = useMemo(() => {
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

  const [currentData, setCurrentData] = useState({});
  const [currentGlobal, setCurrentGlobal] = useState({});
  const handleStateChange = useMemo(
    () =>
      _debounce((newState: XMLBuilderState) => {
        // 此处使用debounce降低资源消耗
        setCurrentData({ ...newState.data });
        setCurrentGlobal({ ...newState.global });
      }, 200),
    []
  );
  const stateDataJSON = useMemo(() => {
    return (
      <ReactJson
        name={false}
        style={{ fontFamily: 'inherit' }}
        src={currentData}
        enableClipboard={false}
        displayObjectSize={false}
        displayDataTypes={false}
      />
    );
  }, [currentData, renderKey]);

  const stateGlobalData = useMemo(() => {
    return (
      <ReactJson
        name="全局变量"
        style={{ fontFamily: 'inherit' }}
        src={currentGlobal}
        enableClipboard={false}
        displayObjectSize={false}
        displayDataTypes={false}
        collapsed={1}
      />
    );
  }, [currentGlobal, renderKey]);

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
            {codeEditor}
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
            <div>{stateDataJSON}</div>
            <div>{stateGlobalData}</div>
          </SplitPane>
        </SplitPane>
      </SplitPane>
    </Container>
  );
});

export default ActorEditor;
