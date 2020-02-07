import * as trpgApi from './trpg.api';
const api = trpgApi.getInstance();

export const sendStartWriting = (type = 'user', uuid: string) => {
  return api.emit('chat::startWriting', { type, uuid });
};

export const sendStopWriting = (type = 'user', uuid: string) => {
  return api.emit('chat::stopWriting', { type, uuid });
};
