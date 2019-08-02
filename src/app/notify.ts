import { AppState, AppStateStatus } from 'react-native';
// import JPushModule from 'jpush-react-native';
import { bindNotifyInfo } from '../redux/actions/notify';
import rnStorage from '../api/rn-storage.api';
import { umPush, Code } from './native/push-utils';

enum PushPlatformType {
  JPush, // 极光推送
  UPush, // 友盟推送
}
const PushPlatform: PushPlatformType = PushPlatformType.UPush; // 此处配置推送的平台

/**
 * 初始化通知模块
 */
export function initNotify() {
  if (PushPlatform === PushPlatformType.JPush) {
    // JPushModule.initPush();
  } else if (PushPlatform === PushPlatformType.UPush) {
    umPush.register((code, ret) => {
      if (code === Code.ERROR) {
        console.error('通知服务初始化失败', ret);
      }
    });
  }
}

// alias为用户的uuid
export async function setAlias(alias: string, platform: 'jpush' | 'upush') {
  if (!alias) {
    console.warn('setAlias failed: alias is required', alias);
    return;
  }

  if (platform === 'jpush') {
    const hasSetJPushAlias = await rnStorage.get('hasSetJPushAlias');
    if (!hasSetJPushAlias || hasSetJPushAlias !== alias) {
      // 如果没有设置别名或设置的别名不为当前用户，则重新设置
      // JPushModule.setAlias(alias, (success) => {
      //   console.log('[JPush]', 'set alias success', success);
      //   rnStorage.save('hasSetJPushAlias', alias);
      // });
    }
  }

  if (platform === 'upush') {
    const hasSetUPushAlias = await rnStorage.get('hasSetUPushAlias');
    if (!hasSetUPushAlias || hasSetUPushAlias !== alias) {
      // 如果没有设置别名或设置的别名不为当前用户，则重新设置
      umPush.addAlias(alias, 'trpg_user', (success) => {
        if (success === 200) {
          console.log('[UPush]', 'set alias success', success);
          rnStorage.save('hasSetJPushAlias', alias);
        } else {
          console.error('[UPush]', 'set alias error');
        }
      });
    }
  }
}

/**
 * 绑定用户信息到服务器
 * @param userUUID 用户UUID
 */
export function bindInfo(userUUID: string) {
  if (PushPlatform === PushPlatformType.JPush) {
    // 极光推送
    // JPushModule.getRegistrationID((registrationID) => {
    //   bindNotifyInfo({
    //     userUUID,
    //     registrationID: String(registrationID),
    //     platform: 'jpush',
    //   });
    //   setAlias(userUUID, 'jpush');
    // });
  } else if (PushPlatform === PushPlatformType.UPush) {
    // 友盟推送
    umPush.getRegistrationId((registrationID) => {
      bindNotifyInfo({ userUUID, registrationID, platform: 'upush' });
      setAlias(userUUID, 'upush');
    });
  }
}

// 监测app状态
let appState: AppStateStatus; // active 前台 background 后台 inactive 切换过程中或来电或多任务
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
    // JPushModule.sendLocalNotification({
    //   title: '信息',
    //   content: messageData,
    // } as any);
  }
}
