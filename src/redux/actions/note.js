const {
  ADD_NOTE,
  GET_NOTE,
  SWITCH_NOTE,
  SAVE_NOTE,
  UPDATE_NOTE,
} = require('../constants');

exports.addNote = function addNote() {
  return {type: ADD_NOTE}
}

exports.saveNote = function saveNote(uuid, title, content) {
  return {type: SAVE_NOTE, payload: {uuid, title, content}}
}

exports.getNote = function getNote() {
  return {type: GET_NOTE}
}

exports.switchNote = function switchNote(uuid) {
  return {type: SWITCH_NOTE, noteUUID: uuid}
}
