const immutable = require('immutable');
const {
  SET_TEMPLATE,
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
});

module.exports = function actor(state = initialState, action) {
  switch (action.type) {
    case SET_TEMPLATE:
    case CREATE_TEMPLATE_SUCCESS:
    case UPDATE_TEMPLATE_SUCCESS:
      return state.set('currentEditedTemplate', immutable.fromJS(action.payload));
    default:
      return state;
  }
  return state;
}
