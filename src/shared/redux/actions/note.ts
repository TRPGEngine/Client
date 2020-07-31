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
} = constants;
import rnStorage from '../../api/rn-storage.api';
import * as trpgApi from '../../api/trpg.api';
import { TRPGAction } from '@redux/types/__all__';
const api = trpgApi.getInstance();

// 同步到服务器
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
