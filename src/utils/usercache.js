const {
  getUserInfo,
  getTemplateInfo
} = require('../redux/actions/cache');

let _store = null;
exports.attachStore = function(store) {
  _store = store;
}

exports.checkUser = function(uuid, type = 'user') {
  let store = _store;
  if(!!store && !!store.dispatch) {
    const state = store.getState();
    if(type === 'user') {
      let info = state.getIn(['cache', 'user', uuid]);
      if(!info) {
        store.dispatch(getUserInfo(uuid));
      }
    }
  }else {
    throw new Error('checkUser func should bind store');
  }
}

exports.checkTemplate = function(uuid) {
  let store = _store;
  if(!!store && !!store.dispatch) {
    const state = store.getState();
    let info = state.getIn(['cache', 'template', uuid]);
    if(!info) {
      store.dispatch(getTemplateInfo(uuid));
    }
  }else {
    throw new Error('checkUser func should bind store');
  }
}

exports.savecache = function() {
  // TODO
}

exports.loadcache = function() {
  // TODO
}
