const axios = require('axios');
const fileUrl = require('../api/trpg.api.js').fileUrl;
const uploadPicHost = 'https://sm.ms/api/upload';

exports.isPasteImage = function(items) {
  let i = 0
  let item
  while (i < items.length) {
    item = items[i]
    if (item.type.indexOf('image') !== -1) {
      return item
    }
    i++
  }
  return false
}

// https://sm.ms/api/upload
exports.upload = function(userUUID, file) {
  let form = new FormData();
  form.append('smfile', file);
  form.append('ssl', true);
  form.append('format', 'json');
  return axios({
    url: uploadPicHost,
    method: 'post',
    data: form,
  }).then(res => {
    let data = res.data;
    if(data.code === 'success') {
      return axios.post(fileUrl + '/chatimg/smms', data.data, {headers: {'user-uuid': userUUID}}).then(res => res.data);
    }else {
      console.error(data);
      return false;
    }
  }).catch(err => {
    console.error(err);
    return false;
  });
}
