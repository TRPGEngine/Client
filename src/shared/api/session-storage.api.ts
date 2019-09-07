let _sessionStorage = {
  set: function(key, value) {
    if (!!key && !!value) {
      sessionStorage[key] = JSON.stringify(value);
    } else if (!!key && typeof key === 'object' && !value) {
      for (var subKey in key) {
        if (key.hasOwnProperty(subKey)) {
          sessionStorage[subKey] = key[subKey] || '';
        }
      }
    }

    return _sessionStorage;
  },
  get: function(key) {
    let ls = sessionStorage[key];

    if (!!ls) {
      try {
        ls = JSON.parse(ls);
      } catch (e) {
        // ls = ls;
        // is string
      }
    } else {
      ls = '';
    }
    return ls;
  },
  push: function(key, value) {
    let arr;
    try {
      arr = sessionStorage[key] ? JSON.parse(sessionStorage[key]) : [];
    } catch (e) {
      console.warn('[sessionStorage::push]', e);
      arr = [];
    }
    arr.push(value);
    sessionStorage[key] = JSON.stringify(arr);
    return _sessionStorage;
  },
  remove: function(key) {
    if (typeof key === 'string') {
      sessionStorage.removeItem(key);
    } else {
      console.warn('sessionStorage remove need string key not', typeof key);
    }
    return _sessionStorage;
  },
};

export default _sessionStorage;
