import constants from '../constants';
const {
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
  SYNC_NOTE,
  MARK_UNSYNC_NOTE,
} = constants;
import rnStorage from '../../api/rn-storage.api';
import * as trpgApi from '../../api/trpg.api';
import { TRPGAction } from '@redux/types/__all__';
import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { NoteInfo } from '@redux/types/note';
const api = trpgApi.getInstance();

// 同步到服务器
/**
 * 同步笔记到服务器
 * 确保一次只同步一个
 */
let isSync = false;
const syncList: any[] = [];
const trySyncNote = function(dispatch, payload) {
  if (isSync === false) {
    isSync = true;
    dispatch({ type: SYNC_NOTE_REQUEST, uuid: payload.uuid });
    api.emit(
      'note::save',
      {
        noteUUID: payload.uuid,
        noteTitle: payload.title,
        noteContent: payload.content,
      },
      function(data) {
        isSync = false;
        if (data.result) {
          dispatch({ type: SYNC_NOTE_SUCCESS });
        } else {
          console.log(data);
          dispatch({ type: SYNC_NOTE_FAILED });
        }

        // 如果队列有东西，则取出后自我迭代
        if (syncList.length > 0) {
          const p = syncList.shift();
          trySyncNote(dispatch, p);
        }
      }
    );
  } else {
    syncList.push(payload);
  }
};

export const addNote = function addNote() {
  return { type: ADD_NOTE };
};

export const saveNote = function saveNote(uuid, title, content) {
  return async function(dispatch, getState) {
    const noteObj = (await rnStorage.get('note')) || {};
    noteObj[uuid] = Object.assign({}, noteObj[uuid], {
      uuid,
      title,
      content,
      updatedAt: new Date().getTime(),
    });
    rnStorage.save('note', noteObj);
    const payload = { uuid, title, content };
    dispatch({ type: SAVE_NOTE, payload });
    trySyncNote(dispatch, payload);
  };
};

export const getNote = function(): TRPGAction {
  return async function(dispatch, getState) {
    const localNote = await rnStorage.get('note');
    if (localNote) {
      dispatch({ type: GET_NOTE, noteList: localNote });
    }
  };
};

export const switchNote = function switchNote(uuid) {
  return { type: SWITCH_NOTE, noteUUID: uuid };
};

// -------------------------------------- 以上为旧版的笔记管理操作 已弃用
// -------------------------------------- 以下为旧版的笔记管理操作

/**
 * 创建笔记
 */
export function createNote(): TRPGAction {
  return async (dispatch, getState) => {
    const { note } = await api.emitP('note::createNote');

    dispatch({
      type: CREATE_NOTE,
      payload: note,
    });
  };
}

/**
 * 获取笔记
 */
export function getNotes(): TRPGAction {
  return async (dispatch, getState) => {
    const { notes } = await api.emitP('note::getUserNotes');

    dispatch({
      type: GET_USER_NOTES,
      payload: notes,
    });
  };
}

interface SyncNoteArgs {
  uuid: string;
  title: string;
  data: object;
}
export const syncNote = createAsyncThunk(
  SYNC_NOTE,
  async (args: SyncNoteArgs): Promise<NoteInfo> => {
    const { note } = await api.emitP('note::saveNote', args);

    return note;
  }
);

export const markUnsyncNote = createAction<{ noteUUID: string }>(
  MARK_UNSYNC_NOTE
);
