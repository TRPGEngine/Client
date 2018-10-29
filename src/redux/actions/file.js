const React = require('react');
const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();
const config = require('../../../config/project.config');
const {showSlidePanel} = require('./ui');

exports.previewFile = function(fileuuid) {
  return function(dispatch, getState) {
    return api.emit('file::getFileInfo', {uuid: fileuuid}, function(data) {
      if(data.previewUrl) {
        console.log('打开预览', data);
        if(data.mimetype.indexOf('image/') >= 0) {
          console.log('是图片')
          // TODO: 图片预览
        }else {
          console.log('在侧边栏打开')
          if(config.platform === 'web' || config.platform === 'electron') {
            const Webview = require('../../web/components/Webview')
            dispatch(showSlidePanel('文件', (
              <Webview src={data.previewUrl}></Webview>
            )))
          }
        }
      }else {
        console.error('无法预览');
      }
    })
  }
}

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
