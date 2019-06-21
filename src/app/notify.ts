import { AppState } from 'react-native';
import JPushModule from 'jpush-react-native';
import { bindNotifyInfo } from '../redux/actions/notify';
import rnStorage from '../api/rnStorage.api.js';

export function init() {
  JPushModule.initPush();
}

// alias为用户的uuid
export async function setAlias(alias) {
  if (alias) {
    const hasSetJPushAlias = await rnStorage.get('hasSetJPushAlias');
    if (!hasSetJPushAlias || hasSetJPushAlias !== alias) {
      // 如果没有设置别名或设置的别名不为当前用户，则重新设置
      JPushModule.setAlias(alias, (success) => {
        console.log('[JPush]', 'set alias success', success);
        rnStorage.save('hasSetJPushAlias', alias);
      });
    }
  } else {
    console.warn('setAlias failed: alias is required', alias);
  }
}

export function bindInfo(userUUID) {
  JPushModule.getRegistrationID((registrationID) => {
    bindNotifyInfo({ userUUID, registrationID });
    setAlias(userUUID);
  });
}

// 监测app状态
let appState; // active 前台 background 后台 inactive 切换过程中或来电或多任务
AppState.addEventListener('change', (nextAppState) => {
  appState = nextAppState;
});
export function tryLocalNotify(messageData) {
  if (appState === 'background') {
    // 仅当应用在后台时。发起本地推送

    // TODO: 待处理
    const sender_uuid = messageData.sender_uuid;
    const message = messageData.message;

    console.log('messageData', messageData);
    // TODO: wait To fix type
    JPushModule.sendLocalNotification({
      title: '信息',
      content: messageData,
    } as any);
  }
}
