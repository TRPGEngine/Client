import React, { useMemo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useLocalStorage } from 'react-use';
import XMLBuilder from '@shared/components/layout/XMLBuilder';
import { Block } from './components/Block';
import _isNil from 'lodash/isNil';
import _find from 'lodash/find';
import { Select, Button, Row, Col } from 'antd';
import { registerLayoutCodeSuggest } from './editor/code/suggestions';
import { exampleLayout, workingLabel, initCode } from './editor/code/example';
import config from '@shared/project.config';
import SplitPane from '@shared/components/web/SplitPane';
import { TMemo } from '@shared/components/TMemo';
import { useLayoutConfig } from './editor/code/useLayoutConfig';
import { useStateWatcher } from './editor/code/useStateWatcher';
import LZString from 'lz-string';
import { useCodeEditor } from './editor/code/useCodeEditor';

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

const ActorEditor = TMemo(() => {
  const { code, setCode, codeEditorEl } = useCodeEditor();
  const { layoutType, isMobile, renderKey, incRenderKey, LayoutConfigEl } =
    useLayoutConfig(code);
  const { stateDataEl, stateGlobalDataEl, updateWatcherState } =
    useStateWatcher(renderKey);

  useEffect(() => {
    // 尝试载入url中的code
    const hash = window.location.hash;
    if (hash.startsWith('#code')) {
      const codehash = hash.split('/')[1] ?? '';
      setCode(LZString.decompressFromEncodedURIComponent(codehash) ?? '');
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

  const handleSelectLayout = useCallback((value: string, option: any) => {
    const xml = option.props.xml;
    setCode(xml);
  }, []);
  const handleResetCode = useCallback(() => {
    setCode(initCode);
  }, []);
  const LayoutActions = useMemo(() => {
    return (
      <Row align="middle" style={{ flex: 1 }}>
        <Col flex={1}>
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
        </Col>
        <Col>
          <div>v{config.version}</div>
        </Col>
      </Row>
    );
  }, []);

  const [splitPos, setSplitPos] = useLocalStorage<number | string>(
    '_playgroundSplitPos',
    '50%'
  );
  const handleResetSplitPos = useCallback(() => {
    setSplitPos('50%');
  }, [setSplitPos]);

  return (
    <Container>
      <SplitPane
        split="vertical"
        size={splitPos}
        onChange={setSplitPos}
        onResizerDoubleClick={handleResetSplitPos}
      >
        <Block label="布局" theme="dark" actions={LayoutActions}>
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#1e1e1e',
            }}
          >
            {codeEditorEl}
          </div>
        </Block>
        <SplitPane split="horizontal" defaultSize="80%">
          <Block label="" theme="light" actions={LayoutConfigEl}>
            <XMLRenderContainer isMobile={isMobile}>
              <XMLBuilder
                key={renderKey}
                layoutType={layoutType}
                xml={code}
                onChange={updateWatcherState}
              />
            </XMLRenderContainer>
          </Block>
          <SplitPane split="vertical" defaultSize="80%">
            <div>{stateDataEl}</div>
            <div>{stateGlobalDataEl}</div>
          </SplitPane>
        </SplitPane>
      </SplitPane>
    </Container>
  );
});
ActorEditor.displayName = 'ActorEditor';

export default ActorEditor;
