import React from 'react';
import { RenderLeafProps } from 'slate-react';

interface EditorLeafProps extends RenderLeafProps {
  editorType: 'richtext' | 'inline';
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
