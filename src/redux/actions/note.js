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
