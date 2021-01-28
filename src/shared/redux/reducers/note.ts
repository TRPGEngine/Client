import constants from '@redux/constants';
import uuid from 'uuid/v1';
import type { NoteState } from '@redux/types/note';
import _set from 'lodash/set';
import _isNil from 'lodash/isNil';
import _findIndex from 'lodash/findIndex';
import { createReducer } from '@reduxjs/toolkit';
import {
  syncNote,
  markUnsyncNote,
  deleteNote,
  markSyncNote,
} from '@redux/actions/note';

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
  // =========== 以上为旧版 以下为新版
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

export default createReducer(initialState, (builder) => {
  builder
    .addCase(RESET, (state) => {
      state = initialState;
    })
    .addCase(ADD_NOTE, (state) => {
      const blankNote = getBlankNote();
      const blankUUID = blankNote.uuid;
      state.noteList[blankUUID] = blankNote;
      state.selectedNoteUUID = blankUUID;
    })
    .addCase(SAVE_NOTE, (state, action: any) => {
      const saveUUID = action.payload.uuid;
      const saveTitle = action.payload.title;
      const saveContent = action.payload.content;

      _set(state.noteList, [saveUUID, 'title'], saveTitle);
      _set(state.noteList, [saveUUID, 'content'], saveContent);
      _set(state.noteList, [saveUUID, 'updatedAt'], new Date().getTime());
    })
    .addCase(GET_NOTE, (state, action: any) => {
      state.noteList = action.noteList;
    })
    .addCase(SWITCH_NOTE, (state, action: any) => {
      state.selectedNoteUUID = action.noteUUID;
    })
    .addCase(SYNC_NOTE_REQUEST, (state, action: any) => {
      state.isSync = true;
      state.isSyncUUID = action.uuid;
    })
    .addCase(SYNC_NOTE_SUCCESS, (state) => {
      state.isSync = false;
      state.isSyncUUID = '';
    })
    .addCase(SYNC_NOTE_FAILED, (state) => {
      state.isSync = false;
      state.isSyncUUID = '';
    });
  // 以上为旧版的笔记管理系统 已弃置

  builder
    .addCase(CREATE_NOTE, (state, action: any) => {
      const isExistedItemIndex = state.list.findIndex(
        (item) => item.uuid === action.payload.uuid
      );
      if (isExistedItemIndex >= 0) {
        // 如果有重复的则删除先前的
        state.list.splice(isExistedItemIndex, 1);
      }
      state.list.push(action.payload);
    })
    .addCase(GET_USER_NOTES, (state, action: any) => {
      const notes = action.payload;

      for (const note of notes) {
        if (_findIndex(state.list, ['uuid', note.uuid]) === -1) {
          // 仅当列表中不存在时才会加入
          // 这样会防止一些操作会覆盖掉之前的
          state.list.push(note);
        }
      }
    })
    .addCase(syncNote.pending, (state, action) => {
      const noteUUID = action.meta.arg.uuid;
      const note = state.list.find((n) => n.uuid === noteUUID);
      if (!_isNil(note)) {
        note.isSyncing = true;
      }
    })
    .addCase(syncNote.fulfilled, (state, action) => {
      const payload = action.payload;
      const noteUUID = payload.uuid;
      const note = state.list.find((n) => n.uuid === noteUUID);
      if (!_isNil(note)) {
        note.title = payload.title;
        note.data = payload.data;
        note.updatedAt = payload.updatedAt;
        note.isSyncing = false;
        note.unsync = false;
      }
    })
    .addCase(markUnsyncNote, (state, action) => {
      const note = state.list.find((n) => n.uuid === action.payload.noteUUID);
      if (!_isNil(note)) {
        note.unsync = true;
      }
    })
    .addCase(markSyncNote, (state, action) => {
      const note = state.list.find((n) => n.uuid === action.payload.noteUUID);
      if (!_isNil(note)) {
        note.unsync = false;
      }
    })
    .addCase(deleteNote.fulfilled, (state, action) => {
      const index = state.list.findIndex(
        (item) => item.uuid === action.meta.arg.uuid
      );
      if (index >= 0) {
        state.list.splice(index, 1);
      }
    });
});
