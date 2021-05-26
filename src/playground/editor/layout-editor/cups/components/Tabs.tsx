import React, { useCallback, useState } from 'react';
import {
  getNodePathById,
  regCup,
  useAST,
  useASTDispatchAction,
  useCurrentTeaId,
} from '@saucerjs/core';
import { Button, Divider, Input, Tabs } from 'antd';
import {
  useTeaAttrsContext,
  renderChildren,
  useTeaRenderOptionsContext,
} from '@saucerjs/editor';
import shortid from 'shortid';
import { InputEditorField } from '../shared';

const CUP_NAME = 'Tabs';
const SUB_CUP_NAME = 'Tab';
regCup({
  name: CUP_NAME,
  displayName: '标签页',
  type: 'container',
  desc: '多标签页组件',
  disableDropEvent: true,
  defaultAttrs: () => {
    return {
      activePanelNodeId: shortid(),
    };
  },
  render: ({ node, path }) => {
    const { currentTeaAttrs, setCurrentTeaAttrs } = useTeaAttrsContext();
    const options = useTeaRenderOptionsContext();

    const handleChange = useCallback((activeKey) => {
      setCurrentTeaAttrs({
        activePanelNodeId: activeKey,
      });
    }, []);

    if (node.type === 'leaf') {
      console.error('[Tabs]', 'Expect node type is `container`');
      return null;
    }

    const tabPanels = node.children.filter(
      (child) => child.cupName === SUB_CUP_NAME
    );
    if (tabPanels.length === 0) {
      return (
        <div
          style={{
            height: 80,
            color: '#ccc',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 18,
          }}
        >
          请在设置面板中增加标签页
        </div>
      );
    }

    return (
      <Tabs
        activeKey={currentTeaAttrs['activePanelNodeId']}
        onChange={handleChange}
      >
        {renderChildren(tabPanels, path, options).map(
          (el: React.ReactNode, i: number) => {
            const sub = node.children[i];
            const attrs = sub.attrs ?? {};

            return (
              <Tabs.TabPane key={sub.id} tab={attrs.label ?? sub.id}>
                {el}
              </Tabs.TabPane>
            );
          }
        )}
      </Tabs>
    );
  },
  editor: () => {
    const [newTabName, setNewTabName] = useState('');
    const { dispatchAppendChildren } = useASTDispatchAction();
    const currentTeaId = useCurrentTeaId();
    const ast = useAST();

    const handleAppend = useCallback(() => {
      if (typeof currentTeaId !== 'string') {
        console.warn('[Tabs]', 'Cannot get currentTeaId');
        return;
      }

      const currentPath = getNodePathById(ast, currentTeaId);
      if (currentPath === false) {
        console.warn('[Tabs]', 'Cannot get currentPath');
        return;
      }
      setNewTabName('');
      dispatchAppendChildren(
        currentPath,
        'container',
        shortid(),
        SUB_CUP_NAME,
        {
          label: newTabName,
        }
      );
    }, [ast, newTabName, currentTeaId, dispatchAppendChildren]);

    return (
      <>
        <InputEditorField field="activePanelNodeId" label="当前面板Key" />

        <Divider>新增面板</Divider>
        <Input
          placeholder="面板名"
          value={newTabName}
          onChange={(e) => setNewTabName(e.target.value)}
        />
        <Button onClick={handleAppend}>新增</Button>
      </>
    );
  },
});

regCup({
  name: SUB_CUP_NAME,
  type: 'container',
  render: ({ children }) => {
    if (Array.isArray(children) && children.length === 0) {
      return (
        <div style={{ padding: 20, textAlign: 'center' }}>请在此处拖入组件</div>
      );
    }

    return <div>{children}</div>;
  },
  editor: () => {
    return (
      <>
        <InputEditorField field="name" label="当前面板名" />
      </>
    );
  },
});
