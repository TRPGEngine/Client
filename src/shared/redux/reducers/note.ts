import constants from '@redux/constants';
import uuid from 'uuid/v1';
import { NoteState } from '@redux/types/note';
import produce from 'immer';
import _set from 'lodash/set';

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
} = constants;

const initialState: NoteState = {
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
  switch (action.type) {
    case RESET:
      return initialState;
    case ADD_NOTE: {
      // let showAlertInfo = action.payload || {};
      const blankNote = getBlankNote();
      const blankUUID = blankNote.uuid;
      draft.noteList[blankUUID] = blankNote;
      draft.selectedNoteUUID = blankUUID;
      return;

      // let blankNote = immutable.fromJS(getBlankNote());
      // let blankUUID = blankNote.get('uuid');
      // return state
      //   .setIn(['noteList', blankUUID], blankNote)
      //   .set('selectedNoteUUID', blankUUID);
    }
    case SAVE_NOTE: {
      const saveUUID = action.payload.uuid;
      const saveTitle = action.payload.title;
      const saveContent = action.payload.content;

      _set(draft.noteList, [saveUUID, 'title'], saveTitle);
      _set(draft.noteList, [saveUUID, 'content'], saveContent);
      _set(draft.noteList, [saveUUID, 'updatedAt'], new Date().getTime());
      return;

      // state = state
      //   .setIn(['noteList', saveUUID, 'title'], saveTitle)
      //   .setIn(['noteList', saveUUID, 'content'], saveContent)
      //   .setIn(['noteList', saveUUID, 'updatedAt'], new Date().getTime());

      // return state;
    }
    case GET_NOTE:
      draft.noteList = action.noteList;
      return;
    // return state.set('noteList', immutable.fromJS(action.noteList));
    case SWITCH_NOTE:
      draft.selectedNoteUUID = action.noteUUID;
      return;
    // return state.set('selectedNoteUUID', action.noteUUID);
    case SYNC_NOTE_REQUEST:
      draft.isSync = true;
      draft.isSyncUUID = action.uuid;
      return;
    // return state.set('isSync', true).set('isSyncUUID', action.uuid);
    case SYNC_NOTE_SUCCESS:
    case SYNC_NOTE_FAILED:
      draft.isSync = false;
      draft.isSyncUUID = '';
      return;
    // return state.set('isSync', false).set('isSyncUUID', '');
  }
}, initialState);
