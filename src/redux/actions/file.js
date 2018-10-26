const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();

exports.downloadFile = function(fileuuid) {
  return function(dispatch, getState) {
    return api.emit('file::getFileInfo', {uuid: fileuuid}, function(data) {
      if(data.downloadUrl) {
        console.log('开始下载');
        let a = document.createElement('a');
        a.style.display = 'none';
        a.href = data.downloadUrl;
        a.download = data.downloadUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }else {
        console.error('无法下载');
      }
    })
  }
}
