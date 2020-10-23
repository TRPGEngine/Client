import React from 'react';
import { useCallback } from 'react';
import { SlateElement } from '../render/Element';
import { SlateLeaf } from '../render/Leaf';

export function useEditorRender(editorType: string) {
  const renderElement = useCallback(
    (props) => <SlateElement editorType={editorType} {...props} />,
    [editorType]
  );
  const renderLeaf = useCallback(
    (props) => <SlateLeaf editorType={editorType} {...props} />,
    [editorType]
  );

  return { renderElement, renderLeaf };
}
