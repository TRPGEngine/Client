import React, { useState, useCallback, useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useParams } from 'react-router';
import { useNoteInfo } from '@redux/hooks/note';
import { Loading } from '@web/components/Loading';
import _isNil from 'lodash/isNil';
import _isString from 'lodash/isString';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import { RichTextEditor } from '@web/components/editor/RichTextEditor';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { Node } from 'slate';
import { WebErrorBoundary } from '@web/components/WebErrorBoundary';
import { AlertErrorView } from '@web/components/AlertErrorView';
import { syncNote, markUnsyncNote } from '@redux/actions/note';
import { useDebounce } from 'react-use';

function getNoteInitData(data?: Node[]): Node[] {
  if (_isEmpty(data)) {
    return [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ];
  }

  return data as Node[];
}
function useNoteData(noteUUID: string) {
  const noteInfo = useNoteInfo(noteUUID);
  const [value, setValue] = useState<Node[]>(() =>
    getNoteInitData(noteInfo?.data)
  );

  const dispatch = useTRPGDispatch();
  const onSave = useCallback(() => {
    if (!_isNil(noteInfo) && _isString(noteInfo.uuid)) {
      dispatch(
        syncNote({
          uuid: noteInfo.uuid,
          title: noteInfo.title,
          data: value,
        })
      );
    }
  }, [value, noteInfo]);

  useDebounce(
    () => {
      if (_isNil(noteInfo)) {
        return;
      }

      if (!_isEqual(value, noteInfo.data)) {
        dispatch(
          markUnsyncNote({
            noteUUID,
          })
        );
      }
    },
    200,
    [value]
  );

  return {
    value,
    setValue,
    onSave,
  };
}

const NoteEditor: React.FC<{ noteUUID: string }> = TMemo((props) => {
  const noteUUID = props.noteUUID;
  const noteInfo = useNoteInfo(noteUUID);
  const { value, setValue, onSave } = useNoteData(noteUUID);

  return (
    <WebErrorBoundary renderError={AlertErrorView}>
      <RichTextEditor
        key={noteUUID}
        value={value}
        onChange={setValue}
        onBlur={onSave}
        onSave={onSave}
      />
    </WebErrorBoundary>
  );
});
NoteEditor.displayName = 'NoteEditor';

interface NotePanelParams {
  noteUUID: string;
}
export const NotePanel: React.FC = TMemo(() => {
  const { noteUUID } = useParams<NotePanelParams>();
  const noteInfo = useNoteInfo(noteUUID);

  if (_isNil(noteInfo)) {
    return <Loading description="正在加载笔记" showAnimation={true} />;
  }

  return <NoteEditor noteUUID={noteUUID} />;
});
NotePanel.displayName = 'NotePanel';
