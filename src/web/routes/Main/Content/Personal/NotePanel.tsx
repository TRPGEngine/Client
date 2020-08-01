import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useParams } from 'react-router';
import { useNoteInfo } from '@redux/hooks/note';
import { Loading } from '@web/components/Loading';
import _isNil from 'lodash/isNil';

interface NotePanelParams {
  noteUUID: string;
}

export const NotePanel: React.FC = TMemo(() => {
  const { noteUUID } = useParams<NotePanelParams>();
  const noteInfo = useNoteInfo(noteUUID);

  if (_isNil(noteInfo)) {
    return <Loading description="正在加载笔记" showAnimation={true} />;
  }

  return <div>选中的笔记: {JSON.stringify(noteInfo.data)}</div>;
});
NotePanel.displayName = 'NotePanel';
