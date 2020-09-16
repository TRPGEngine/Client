import React, { useMemo, useCallback } from 'react';
import { Slate, Editable } from 'slate-react';
import { TRPGEditorNode } from './types';
import { createStandardEditor } from './instance';
import { SlateElement } from './render/Element';
import { SlateLeaf } from './render/Leaf';
import { TMemo } from '@shared/components/TMemo';
import { WebErrorBoundary } from '../WebErrorBoundary';

export const Previewer: React.FC<{
  value: TRPGEditorNode[];
}> = TMemo((props) => {
  const editor = useMemo(() => createStandardEditor(), []);
  const renderElement = useCallback((props) => <SlateElement {...props} />, []);
  const renderLeaf = useCallback((props) => <SlateLeaf {...props} />, []);

  return (
    <WebErrorBoundary>
      <Slate editor={editor} value={props.value} onChange={(value) => {}}>
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
