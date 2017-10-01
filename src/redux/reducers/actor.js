const immutable = require('immutable');
const {
  SET_TEMPLATE,
  GET_TEMPLATE_SUCCESS,
  FIND_TEMPLATE_SUCCESS,
  CREATE_TEMPLATE_SUCCESS,
  UPDATE_TEMPLATE_SUCCESS,
  SET_EDITED_TEMPLATE,
  SELECT_TEMPLATE,
  CREATE_ACTOR_SUCCESS,
  GET_ACTOR_SUCCESS,
  SELECT_ACTOR,
  REMOVE_ACTOR_SUCCESS,
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
  selectedTemplate: {},
  currentEditedActorUUID: '',
  selfActors: [],
  selectedActorUUID: '',// actor UUID
});

function updateSelfTemplate(list, uuid, template) {
  for (var i = 0; i < list.size; i++) {
    if(uuid === list.getIn([i, 'uuid'])) {
      return list.set(i, immutable.fromJS(template))
    }
  }
  return list;
}

function updateSelfActor(list, uuid, actor) {
  for (var i = 0; i < list.size; i++) {
    if(uuid === list.getIn([i, 'uuid'])) {
      return list.set(i, immutable.fromJS(actor))
    }
  }
  return list;
}

module.exports = function actor(state = initialState, action) {
  switch (action.type) {
    case FIND_TEMPLATE_SUCCESS:
      return state.set('findingResult', immutable.fromJS(action.payload));
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
    case SET_EDITED_TEMPLATE:
      return state.set('currentEditedTemplate', immutable.fromJS(action.payload));
    case SELECT_TEMPLATE:
      return state.set('selectedTemplate', immutable.fromJS(action.payload));
    case CREATE_ACTOR_SUCCESS:
      return state.update('selfActors', (list) => list.push(immutable.fromJS(action.payload)));
    case GET_ACTOR_SUCCESS:
      if(action.uuid) {
        return state.update('selfActors', (list) => updateSelfActor(list, action.uuid, action.payload))
      }else {
        return state.set('selfActors', immutable.fromJS(action.payload));
      }
    case SELECT_ACTOR:
      return state.set('selectedActorUUID', action.payload);
    case REMOVE_ACTOR_SUCCESS:
      return state.update('selfActors', (list) => {
        for (var i = 0; i < list.size; i++) {
          if(list.getIn([i, 'uuid']) === action.uuid) {
            return list.delete(i);
          }
        }
        return list;
      })
    default:
      return state;
  }
  return state;
}
