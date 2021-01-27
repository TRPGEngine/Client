import React, { ComponentType } from 'react';
import * as trpgApi from '@shared/api/trpg.api';
import config from '@shared/project.config';
import { showSlidePanel, showLightbox } from './ui';
import type { TRPGAction } from '@redux/types/__all__';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import { downloadFileWeb } from '@shared/utils/file-helper';

const api = trpgApi.getInstance();

interface PreviewFileOptions {
  WebviewComponent?: ComponentType<{ src: string }>;
}
export const previewFile = function (
  fileuuid: string,
  options?: PreviewFileOptions
): TRPGAction {
  return function (dispatch, getState) {
    return api.emit('file::getFileInfo', { uuid: fileuuid }, function (data) {
      const previewUrl = data.previewUrl;
      if (previewUrl) {
        console.log('打开预览', data);
        if (data.mimetype.indexOf('image/') >= 0) {
          console.log('是图片');
          dispatch(showLightbox(previewUrl));
        } else {
          console.log('在侧边栏打开');
          if (config.platform === 'web' || config.platform === 'electron') {
            const WebviewComponent = _get(options, 'WebviewComponent');
            if (_isNil(WebviewComponent)) {
              console.error('预览失败: 需要放入WebviewComponent');
              return;
            }
            dispatch(
              showSlidePanel(
                '文件',
                React.createElement(WebviewComponent, {
                  src: previewUrl,
                })
              )
            );
          }
        }
      } else {
        console.error('无法预览');
      }
    });
  };
};

export const downloadFile = function (fileuuid: string): TRPGAction {
  return function (dispatch, getState) {
    return api.emit('file::getFileInfo', { uuid: fileuuid }, function (data) {
      const url = data.downloadUrl; // 下载地址
      if (url) {
        console.log('开始下载:', url);
        downloadFileWeb(url);
      } else {
        console.error('无法下载');
      }
    });
  };
};
