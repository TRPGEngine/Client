import React, { Fragment, useState, useCallback, useEffect } from 'react';
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
import { syncNote, markUnsyncNote, deleteNote } from '@redux/actions/note';
import { useBeforeUnload, useDebounce } from 'react-use';
import { SectionHeader } from '@web/components/SectionHeader';
import { Input, Empty, Modal } from 'antd';
import { isSaveHotkey } from '@web/utils/hot-key';
import { Iconfont } from '@web/components/Iconfont';
import { ImageButton } from './ImageButton';

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
  const [title, setTitle] = useState(noteInfo?.title ?? '');
  const [value, setValue] = useState<Node[]>(() =>
    getNoteInitData(noteInfo?.data)
  );

  const isUnsync = noteInfo?.unsync;

  const dispatch = useTRPGDispatch();
  const onSave = useCallback(() => {
    if (_isNil(noteInfo)) {
      return;
    }

    if (!_isString(noteInfo.uuid)) {
      return;
    }

    if (noteInfo.unsync === false) {
      return;
    }

    dispatch(
      syncNote({
        uuid: noteInfo.uuid,
        title,
        data: value,
      })
    );
  }, [title, value, noteInfo]);

  useDebounce(
    () => {
      if (_isNil(noteInfo)) {
        return;
      }

      if (!_isEqual(title, noteInfo.title)) {
        dispatch(
          markUnsyncNote({
            noteUUID,
          })
        );
      }
    },
    200,
    [title]
  );

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
    title,
    setTitle,
    value,
    setValue,
    onSave,
    isUnsync,
  };
}

const NoteBeforeUnload: React.FC = () => {
  useBeforeUnload(true, '确定要离开页面么? 未保存的笔记会丢失');

  return null;
};
NoteBeforeUnload.displayName = 'NoteBeforeUnload';

const NoteEditor: React.FC<{ noteUUID: string }> = TMemo((props) => {
  const noteUUID = props.noteUUID;
  const { title, setTitle, value, setValue, onSave, isUnsync } = useNoteData(
    noteUUID
  );
  const dispatch = useTRPGDispatch();

  // 删除笔记
  const handleDeleteNote = useCallback(() => {
    Modal.confirm({
      content: `确定要删除笔记 ${title} 么`,
      onOk: () => {
        dispatch(deleteNote({ uuid: noteUUID }));
      },
    });
  }, [noteUUID, title]);

  return (
    <WebErrorBoundary renderError={AlertErrorView}>
      {isUnsync && <NoteBeforeUnload />}
      <SectionHeader>
        <Input
          style={{ color: 'white', fontWeight: 'bold' }}
          placeholder="笔记标题"
          bordered={false}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={onSave}
          onKeyDown={(e) => {
            if (isSaveHotkey(e.nativeEvent)) {
              e.preventDefault();
              onSave();
            }
          }}
        />
      </SectionHeader>
      <RichTextEditor
        key={noteUUID}
        style={{ flex: 1, overflow: 'hidden' }}
        value={value}
        onChange={setValue}
        customButton={
          <Fragment>
            <ImageButton attachUUID={noteUUID} />
          </Fragment>
        }
        customActions={[
          {
            icon: <Iconfont key="del">&#xe76b;</Iconfont>,
            action: handleDeleteNote,
          },
        ]}
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
    return <Empty style={{ paddingTop: 100 }} description="找不到笔记" />;
  }

  return <NoteEditor key={noteUUID} noteUUID={noteUUID} />;
});
NotePanel.displayName = 'NotePanel';
