import React from 'react';
import { useSlate } from 'slate-react';
import { ToolbarButton } from '../style';
import { isBlockActive, toggleBlock } from '../utils';
import { TMemo } from '@shared/components/TMemo';

interface Props {
  format: string;
  icon: React.ReactNode;
}
export const BlockButton: React.FC<Props> = TMemo((props) => {
  const { format, icon } = props;
  const editor = useSlate();

  return (
    <ToolbarButton
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </ToolbarButton>
  );
});
BlockButton.displayName = 'BlockButton';
