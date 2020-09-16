import React from 'react';
import { useSlate } from 'slate-react';
import { ToolbarButton } from '../style';
import { isMarkActive, toggleMark } from '../utils';
import { TMemo } from '@shared/components/TMemo';

interface Props {
  format: string;
  icon: React.ReactNode;
}
export const MarkButton: React.FC<Props> = TMemo((props) => {
  const { format, icon } = props;
  const editor = useSlate();

  return (
    <ToolbarButton
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </ToolbarButton>
  );
});
MarkButton.displayName = 'MarkButton';
