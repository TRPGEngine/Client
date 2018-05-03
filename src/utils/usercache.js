const {
  getUserInfo,
  getTemplateInfo
} = require('../redux/actions/cache');
const isUUID = require('is-uuid');

let _store = null;
exports.attachStore = function(store) {
  _store = store;
}

exports.checkUser = function(uuid, type = 'user') {
  if(!isUUID.v1(uuid)) {
    console.warn('该UUID不是一个合法的UUID', uuid);
    return;
  }

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
