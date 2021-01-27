import _throttle from 'lodash/throttle';
import config from '@shared/project.config';
import type { ConverseType } from '@redux/types/chat';
import * as trpgApi from './trpg.api';
import { getSystemSettings } from '@redux/helpers/settings';
const api = trpgApi.getInstance();

/**
 * 发送开始写
 */
export const sendStartWriting = _throttle(
  (type: ConverseType = 'user', uuid: string, currentText?: string) => {
    if (getSystemSettings<boolean>('disableSendWritingState', false) === true) {
      return;
    }

    return api.emit('chat::startWriting', { type, uuid, currentText });
  },
  config.chat.isWriting.throttle,
  { leading: false, trailing: true }
);

/**
 * 发送终止写
 */
export const sendStopWriting = _throttle(
  (type: ConverseType = 'user', uuid: string) => {
    if (getSystemSettings<boolean>('disableSendWritingState', false) === true) {
      return;
    }

    return api.emit('chat::stopWriting', { type, uuid });
  },
  config.chat.isWriting.throttle,
  { leading: false, trailing: true }
);
