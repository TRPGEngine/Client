import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { CommonPanelProps } from '@shared/components/panel/type';

/**
 * 团笔记面板
 */
export const NotePanel: React.FC<CommonPanelProps> = TMemo((props) => {
  const { panel } = props;

  // TODO
  return <div>target_uuid: {panel.target_uuid}</div>;
});
NotePanel.displayName = 'NotePanel';
