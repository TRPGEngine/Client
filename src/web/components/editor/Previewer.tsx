import React, { useMemo, useCallback } from 'react';
import { Slate, Editable } from 'slate-react';
import { createStandardEditor } from './instance';
import { SlateElement } from './render/Element';
import { SlateLeaf } from './render/Leaf';
import { TMemo } from '@shared/components/TMemo';
import { WebErrorBoundary } from '../WebErrorBoundary';
import _isArray from 'lodash/isArray';
import { Result } from 'antd';
import type { TRPGEditorValue } from './types';

export const Previewer: React.FC<{
  nodes: TRPGEditorValue[];
}> = TMemo((props) => {
  const editor = useMemo(() => createStandardEditor(), []);
  const renderElement = useCallback((props) => <SlateElement {...props} />, []);
  const renderLeaf = useCallback((props) => <SlateLeaf {...props} />, []);

  if (!_isArray(props.nodes)) {
    return (
      <Result status="warning" title="笔记数据异常, 请检查是否为旧版笔记" />
    );
  }

  return (
    <WebErrorBoundary>
      <Slate editor={editor} value={props.nodes} onChange={(value) => {}}>
        <Editable
          readOnly={true}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
        />
      </Slate>
    </WebErrorBoundary>
  );
});
Previewer.displayName = 'Previewer';
