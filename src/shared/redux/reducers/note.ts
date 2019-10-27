import constants from '@redux/constants';
import immutable from 'immutable';
import uuid from 'uuid/v1';
import { NoteState } from '@redux/types/note';

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

const initialState: NoteState = immutable.fromJS({
  noteList: {},
  selectedNoteUUID: '',
  isSync: false,
  isSyncUUID: '',
});

function getBlankNote() {
  return {
    uuid: uuid(),
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    title: '笔记标题',
    content: '欢迎使用笔记本',
  };
}

export default function ui(state = initialState, action) {
  switch (action.type) {
    case RESET:
      return initialState;
    case ADD_NOTE: {
      // let showAlertInfo = action.payload || {};
      let blankNote = immutable.fromJS(getBlankNote());
      let blankUUID = blankNote.get('uuid');
      return state
        .setIn(['noteList', blankUUID], blankNote)
        .set('selectedNoteUUID', blankUUID);
    }
    case SAVE_NOTE: {
      let saveUUID = action.payload.uuid;
      let saveTitle = action.payload.title;
      let saveContent = action.payload.content;

      state = state
        .setIn(['noteList', saveUUID, 'title'], saveTitle)
        .setIn(['noteList', saveUUID, 'content'], saveContent)
        .setIn(['noteList', saveUUID, 'updatedAt'], new Date().getTime());

      return state;
    }
    case GET_NOTE:
      return state.set('noteList', immutable.fromJS(action.noteList));
    case SWITCH_NOTE:
      return state.set('selectedNoteUUID', action.noteUUID);
    case SYNC_NOTE_REQUEST:
      return state.set('isSync', true).set('isSyncUUID', action.uuid);
    case SYNC_NOTE_SUCCESS:
    case SYNC_NOTE_FAILED:
      return state.set('isSync', false).set('isSyncUUID', '');
    default:
      return state;
  }
}
