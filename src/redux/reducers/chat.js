const immutable = require('immutable');

const initialState = immutable.fromJS({
  converses: {}
});

module.exports = function chat(state = initialState, action) {
  try {
    switch (action.type) {
      case 'ADD_CONVERSES':
        let uuid = action.payload.get('uuid');
        return state.setIn(['converses', uuid], action.payload);
      case 'ADD_MSG':
        let converseUUID = action.converseUUID;
        return state.updateIn(['converses', converseUUID, 'msgList'], (msgList) => msgList.push(action.payload));
      default:
        return state;
    }
  } catch (e) {
    console.error(e);
    return state;
  }
}
