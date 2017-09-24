const immutable = require('immutable');
const {
  SET_TEMPLATE,
  GET_TEMPLATE_SUCCESS,
  CREATE_TEMPLATE_SUCCESS,
  UPDATE_TEMPLATE_SUCCESS,
} = require('../constants');
const initialState = immutable.fromJS({
  isFindingTemplate: false,// 模板查询页面
  findingResult: [],// 模板查询结果
  currentEditedTemplate: {
    uuid: '',
    name: '模板名',
    desc: '',
    avatar: '',
    info: '',
  },
  selfTemplate: [],
});

function updateSelfTemplate(list, uuid, template) {
  for (var i = 0; i < list.length; i++) {
    if(uuid === list[i].uuid) {
      list[i] = immutable.fromJS(template);
      break;
    }
  }
  return list;
}

module.exports = function actor(state = initialState, action) {
  switch (action.type) {
    case CREATE_TEMPLATE_SUCCESS:
      return state
        .set('currentEditedTemplate', immutable.fromJS(action.payload))
        .update('selfTemplate', (list) => list.push(immutable.fromJS(action.payload)));
    case SET_TEMPLATE:
    case UPDATE_TEMPLATE_SUCCESS:
      return state
        .set('currentEditedTemplate', immutable.fromJS(action.payload))
        .update('selfTemplate', (list) => updateSelfTemplate(list, action.payload.uuid, action.payload));
    case GET_TEMPLATE_SUCCESS:
      if(action.uuid) {
        return state.update('selfTemplate', (list) => updateSelfTemplate(list, action.uuid, action.payload))
      }else {
        return state.set('selfTemplate', immutable.fromJS(action.payload));
      }
    default:
      return state;
  }
  return state;
}
