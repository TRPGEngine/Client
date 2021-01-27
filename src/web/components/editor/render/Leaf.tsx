import React from 'react';
import type { RenderLeafProps } from 'slate-react';
import type { EditorType } from './type';

interface EditorLeafProps extends RenderLeafProps {
  editorType: EditorType;
}

export const SlateLeaf: React.FC<EditorLeafProps> = ({
  attributes,
  children,
  leaf,
}) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};
