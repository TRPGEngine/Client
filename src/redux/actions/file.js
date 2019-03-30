const React = require('react');
const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();
const config = require('../../../config/project.config');
const { showSlidePanel, showLightbox } = require('./ui');

exports.previewFile = function(fileuuid) {
  return function(dispatch, getState) {
    return api.emit('file::getFileInfo', { uuid: fileuuid }, function(data) {
      const previewUrl = data.previewUrl;
      if (previewUrl) {
        console.log('打开预览', data);
        if (data.mimetype.indexOf('image/') >= 0) {
          console.log('是图片');
          dispatch(showLightbox(previewUrl));
        } else {
          console.log('在侧边栏打开');
          if (config.platform === 'web' || config.platform === 'electron') {
            const Webview = require('../../web/components/Webview');
            dispatch(showSlidePanel('文件', <Webview src={previewUrl} />));
          }
        }
      } else {
        console.error('无法预览');
      }
    });
  };
};

exports.downloadFile = function(fileuuid) {
  return function(dispatch, getState) {
    return api.emit('file::getFileInfo', { uuid: fileuuid }, function(data) {
      const url = data.downloadUrl; // 下载地址
      if (url) {
        console.log('开始下载:', url);
        let a = document.createElement('a');
        // a.target = '_blank';
        a.style.display = 'none';
        a.href = url;
        a.download = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        console.error('无法下载');
      }
    });
  };
};
