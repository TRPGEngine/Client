const {
  ADD_NOTE,
  GET_NOTE,
  SWITCH_NOTE,
  SAVE_NOTE,
  // UPDATE_NOTE,
} = require('../constants');
const rnStorage = require('../../api/rnStorage.api.js');

exports.addNote = function addNote() {
  return {type: ADD_NOTE}
}

exports.saveNote = function saveNote(uuid, title, content) {
  (async () => {
    let noteObj = await rnStorage.get('note') || {};
    noteObj[uuid] = Object.assign({}, noteObj[uuid], {
      uuid,
      title,
      content,
      updatedAt: new Date().getTime()
    })
    rnStorage.set('note', noteObj);
  })();
  return {type: SAVE_NOTE, payload: {uuid, title, content}}
}

exports.getNote = function getNote() {
  return async function(dispatch, getState) {
    let localNote = await rnStorage.get('note');
    if(localNote) {
      dispatch({type: GET_NOTE, noteList: localNote});
    }
  }
}

exports.switchNote = function switchNote(uuid) {
  return {type: SWITCH_NOTE, noteUUID: uuid}
}
