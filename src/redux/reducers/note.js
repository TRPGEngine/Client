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
      // TODO save to server
      return state.setIn(['noteList', saveUUID, 'content'], saveContent);
    default:
      return state;
  }
}
