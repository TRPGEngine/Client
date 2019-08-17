import React from 'react';
import * as trpgApi from '../../api/trpg.api';
import config from '../../../config/project.config';
import { showSlidePanel, showLightbox } from './ui';
import Webview from '../../web/components/Webview';

const api = trpgApi.getInstance();

export const previewFile = function(fileuuid) {
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
            dispatch(showSlidePanel('文件', <Webview src={previewUrl} />));
          }
        }
      } else {
        console.error('无法预览');
      }
    });
  };
};

export const downloadFile = function(fileuuid) {
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
