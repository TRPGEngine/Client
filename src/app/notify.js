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
