const _localStorage = {
  set(key, value) {
    if (!!key && !!value) {
      localStorage[key] = JSON.stringify(value);
    } else if (!!key && typeof key === 'object' && !value) {
      for (const subKey in key) {
        if (key.hasOwnProperty(subKey)) {
          localStorage[subKey] = key[subKey] || '';
        }
      }
    }

    return _localStorage;
  },
  get(key) {
    let ls = localStorage[key];

    if (!!ls) {
      try {
        ls = JSON.parse(ls);
      } catch (e) {
        console.warn(e);
      }
    } else {
      ls = '';
    }
    return ls;
  },
  push(key, value) {
    let arr;
    try {
      arr = localStorage[key] ? JSON.parse(localStorage[key]) : [];
    } catch (e) {
      console.warn('[localStorage::push]', e);
      arr = [];
    }
    arr.push(value);
    localStorage[key] = JSON.stringify(arr);
    return _localStorage;
  },
  remove(key) {
    if (typeof key === 'string') {
      localStorage.removeItem(key);
    } else {
      console.warn('localStorage remove need string key not', typeof key);
    }
    return _localStorage;
  },
};

export default _localStorage;
