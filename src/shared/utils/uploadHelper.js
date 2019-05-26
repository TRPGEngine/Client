import axios from 'axios';
import { fileUrl } from '../../api/trpg.api.js';

export const generateFileMsgData = function(file) {
  let tmp = file.name.split('.');
  return {
    originalname: file.name,
    size: file.size,
    ext: tmp[tmp.length - 1],
    progress: 0,
  };
};

let _upload = function(path, userUUID, file, cb) {
  let form = new FormData();
  form.append('file', file);
  return axios({
    url: fileUrl + path,
    method: 'post',
    data: form,
    headers: { 'user-uuid': userUUID },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.lengthComputable) {
        cb &&
          cb.onProgress &&
          cb.onProgress(progressEvent.loaded / progressEvent.total);
      }
    },
  })
    .then((res) => {
      cb && cb.onCompleted && cb.onCompleted(res.data);
    })
    .catch((err) => {
      console.error(err, JSON.stringify(err));
      return false;
    });
};

export const toTemporary = function(userUUID, file, cb) {
  _upload('/upload/temporary', userUUID, file, cb);
};

export const toPersistence = function(userUUID, file, cb) {
  _upload('/upload/persistence', userUUID, file, cb);
};
