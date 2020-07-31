import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useParams } from 'react-router';

interface NotePanelParams {
  noteUUID: string;
}

export const NotePanel: React.FC = TMemo(() => {
  const { noteUUID } = useParams<NotePanelParams>();

  return <div>选中的笔记: {noteUUID}</div>;
});
NotePanel.displayName = 'NotePanel';
