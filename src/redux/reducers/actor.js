const immutable = require('immutable');

const initialState = immutable.fromJS({
  isFindingTemplate: false,// 模板查询页面
  findingResult: [],// 模板查询结果
});

module.exports = function actor(state = initialState, action) {
  return state;
}
