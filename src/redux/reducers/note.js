const {
  ADD_NOTE,
  GET_NOTE,
  SWITCH_NOTE,
  SAVE_NOTE,
  UPDATE_NOTE,
} = require('../constants');
const immutable = require('immutable');
const moment = require('moment');
const uuid = require('uuid/v1');
const localStorage = require('../../api/localStorage.api.js');

const initialState = immutable.fromJS({
  noteList: {},
  selectedNoteUUID: '',
})

function getBlankNote() {
  return {
    uuid: uuid(),
    created_At: moment().valueOf(),
    updated_At: moment().valueOf(),
    title: '笔记标题',
    content: '欢迎使用笔记本',
  }
}

module.exports = function ui(state = initialState, action) {
  switch (action.type) {
    case ADD_NOTE:
      let showAlertInfo = action.payload || {};
      let blankNote = immutable.fromJS(getBlankNote());
      let blankUUID = blankNote.get('uuid');
      return state.setIn(['noteList', blankUUID], blankNote).set('selectedNoteUUID', blankUUID);
    case SAVE_NOTE:
      let saveUUID = action.payload.uuid;
      let saveContent = action.payload.content;
      let noteObj = localStorage.get('note');

      state = state.setIn(['noteList', saveUUID, 'content'], saveContent)
        .setIn(['noteList', saveUUID, 'updated_At'], moment().valueOf());

      noteObj[saveUUID] = state.getIn(['noteList', saveUUID]).toJS();
      localStorage.set('note', noteObj);

      return state;
    case GET_NOTE:
      let localNote = localStorage.get('note');
      return state.set('noteList', immutable.fromJS(localNote));
    case SWITCH_NOTE:
      return state.set('selectedNoteUUID', action.noteUUID);
    default:
      return state;
  }
}
