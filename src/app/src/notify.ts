import { AppState, AppStateStatus } from 'react-native';
// import JPushModule from 'jpush-react-native';
import { bindNotifyInfo } from '@shared/redux/actions/notify';
import rnStorage from '@shared/api/rn-storage.api';
import { umPush, Code } from './native/push-utils';
import { clearAllNotifications, sendBasicNotify } from './native/trpg';
import _isNil from 'lodash/isNil';

import * as trpgApi from '@shared/api/trpg.api';
const api = trpgApi.getInstance();

// alias为用户的uuid
export async function setAlias(alias: string) {
  if (!alias) {
    console.warn('setAlias failed: alias is required', alias);
    return;
  }

  const hashKey = 'hasSetUPushAlias';

  const hasSetUPushAlias = await rnStorage.get(hashKey);
  if (!hasSetUPushAlias || hasSetUPushAlias !== alias) {
    // 如果没有设置别名或设置的别名不为当前用户，则重新设置
    umPush.addAlias(alias, 'trpg_user', (success) => {
      if (success === Code.SUCCESS) {
        console.log('[UPush]', 'set alias success', success);
        rnStorage.save(hashKey, alias);
      } else {
        console.warn('[UPush]', 'set alias error');
      }
    });
  }
}

/**
 * 绑定用户信息到服务器
 * @param userUUID 用户UUID
 */
export function bindInfo(userUUID: string) {
  // 友盟推送
  umPush.getRegistrationId((registrationID) => {
    if (_isNil(registrationID)) {
      console.warn('获取不到设备唯一标识', registrationID);
      return;
    }

    bindNotifyInfo({ userUUID, registrationID, platform: 'upush' });
    setAlias(userUUID);
  });
}

// 监测app状态
let appState: AppStateStatus; // active 前台 background 后台 inactive 切换过程中或来电或多任务
AppState.addEventListener('change', (nextAppState) => {
  appState = nextAppState;

  if (nextAppState === 'active') {
    // 清理所有推送
    clearAllNotifications();
  }
});
export function tryLocalNotify(name: string, message: string) {
  if (appState === 'background') {
    // 仅当应用在后台时。发起本地推送
    sendBasicNotify({ title: name, message });
  }
}

/**
 * TODO: 未实装 设置
 * 激活使用Notify
 */
export const activeNofify = async () => {
  umPush.getRegistrationId((registrationID) => {
    api.emit('notify::activeNofify', { registrationID }, (data) => {
      if (data.result) {
        console.log('激活推送');
      }
    });
  });
};

/**
 * TODO: 未实装 设置
 * 取消使用Notify
 */
export const deactiveNofify = async () => {
  umPush.getRegistrationId((registrationID) => {
    api.emit('notify::deactiveNofify', { registrationID }, (data) => {
      if (data.result) {
        console.log('取消推送');
      }
    });
  });
};
