import { API } from './socket-api';
import config from '@shared/project.config';

let api: API; // 单例模式
export function getInstance(): API {
  if (!api) {
    api = new API();
    if (config.environment !== 'test') {
      console.log('new socket client connect created!', api);
    }
  }

  return api;
}

export function setEventErrorHandler(cb) {
  getInstance().handleEventError = cb;
}

export const fileUrl = config.file.url + '/file';
