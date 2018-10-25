const axios = require('axios');
const fileUrl = require('../../api/trpg.api.js').fileUrl;

exports.generateFileMsgData = function(file) {
  let tmp = file.name.split('.');
  return {
    originalname: file.name,
    size: file.size,
    ext: tmp[tmp.length - 1],
    progress: 0,
  }
}

let _upload = function(path, userUUID, file, cb) {
  let form = new FormData();
  form.append('file', file);
  return axios({
    url: fileUrl + path,
    method: 'post',
    data: form,
    headers: {'user-uuid': userUUID}
  }).then(res => {
    cb && cb.onCompleted && cb.onCompleted(res.data);
  }).catch(err => {
    console.error(err);
    return false;
  });
}

exports.toTemporary = function(userUUID, file, cb) {
  _upload('/upload/temporary', userUUID, file, cb);
}

exports.toPersistence = function(userUUID, file, cb) {
  _upload('/upload/persistence', userUUID, file, cb);
}
