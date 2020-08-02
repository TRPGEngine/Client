import React, { useState, useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useParams } from 'react-router';
import { useNoteInfo } from '@redux/hooks/note';
import { Loading } from '@web/components/Loading';
import _isNil from 'lodash/isNil';
import { RichTextEditor } from '@web/components/editor/RichTextEditor';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { useRNStorage } from '@shared/hooks/useRNStorage';
import { Node } from 'slate';
import { WebErrorBoundary } from '@web/components/WebErrorBoundary';
import { AlertErrorView } from '@web/components/AlertErrorView';

function useNoteData(noteUUID: string) {
  const noteInfo = useNoteInfo(noteUUID);
  const [value, setValue] = useRNStorage<Node[]>(`note#${noteUUID}`, [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);
  const dispatch = useTRPGDispatch();
  const onSave = useCallback(() => {
    // TODO
    // dispatch()
  }, []);

  return {
    value,
    setValue,
    onSave,
  };
}

interface NotePanelParams {
  noteUUID: string;
}

export const NotePanel: React.FC = TMemo(() => {
  const { noteUUID } = useParams<NotePanelParams>();
  const noteInfo = useNoteInfo(noteUUID);
  const { value, setValue, onSave } = useNoteData(noteUUID);

  if (_isNil(noteInfo)) {
    return <Loading description="正在加载笔记" showAnimation={true} />;
  }

  return (
    <WebErrorBoundary renderError={AlertErrorView}>
      <RichTextEditor
        key={noteUUID}
        value={value}
        onChange={setValue}
        onBlur={onSave}
      />
    </WebErrorBoundary>
  );
});
NotePanel.displayName = 'NotePanel';
