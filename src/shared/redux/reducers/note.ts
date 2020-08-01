import constants from '@redux/constants';
import uuid from 'uuid/v1';
import { NoteState } from '@redux/types/note';
import produce from 'immer';
import _set from 'lodash/set';
import _isNil from 'lodash/isNil';
import _findIndex from 'lodash/findIndex';

const {
  RESET,
  ADD_NOTE,
  GET_NOTE,
  SWITCH_NOTE,
  SAVE_NOTE,
  // UPDATE_NOTE,
  SYNC_NOTE_REQUEST,
  SYNC_NOTE_SUCCESS,
  SYNC_NOTE_FAILED,

  CREATE_NOTE,
  GET_USER_NOTES,
} = constants;

const initialState: NoteState = {
  list: [],
  noteList: {},
  selectedNoteUUID: '',
  isSync: false,
  isSyncUUID: '',
};

function getBlankNote() {
  return {
    uuid: uuid(),
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    title: '笔记标题',
    content: '欢迎使用笔记本',
  };
}

export default produce((draft: NoteState, action) => {
  const payload = action.payload;
  switch (action.type) {
    case RESET:
      return initialState;
    case ADD_NOTE: {
      const blankNote = getBlankNote();
      const blankUUID = blankNote.uuid;
      draft.noteList[blankUUID] = blankNote;
      draft.selectedNoteUUID = blankUUID;
      return;
    }
    case SAVE_NOTE: {
      const saveUUID = action.payload.uuid;
      const saveTitle = action.payload.title;
      const saveContent = action.payload.content;

      _set(draft.noteList, [saveUUID, 'title'], saveTitle);
      _set(draft.noteList, [saveUUID, 'content'], saveContent);
      _set(draft.noteList, [saveUUID, 'updatedAt'], new Date().getTime());
      return;
    }
    case GET_NOTE:
      draft.noteList = action.noteList;
      return;
    case SWITCH_NOTE:
      draft.selectedNoteUUID = action.noteUUID;
      return;
    case SYNC_NOTE_REQUEST:
      draft.isSync = true;
      draft.isSyncUUID = action.uuid;
      return;
    case SYNC_NOTE_SUCCESS:
    case SYNC_NOTE_FAILED:
      draft.isSync = false;
      draft.isSyncUUID = '';
      return;
    // 以上为旧版的笔记管理系统 已弃置
    case CREATE_NOTE: {
      const isExistedItemIndex = draft.list.findIndex(
        (item) => item.uuid === payload.uuid
      );
      if (isExistedItemIndex >= 0) {
        // 如果有重复的则删除先前的
        draft.list.splice(isExistedItemIndex, 1);
      }
      draft.list.push(payload);

      return;
    }
    case GET_USER_NOTES: {
      const notes = payload;

      for (const note of notes) {
        if (_findIndex(draft.list, ['uuid', note.uuid]) === -1) {
          // 仅当列表中不存在时才会加入
          // 这样会防止一些操作会覆盖掉之前的
          draft.list.push(note);
        }
      }
      return;
    }
  }
}, initialState);
