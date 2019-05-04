import JPushModule from 'jpush-react-native';
import { bindNotifyInfo } from '../redux/actions/notify';
import rnStorage from '../api/rnStorage.api.js';

export function init() {
  JPushModule.initPush();
}

export async function setAlias(alias) {
  if (alias) {
    const hasSetJPushAlias = await rnStorage.get('hasSetJPushAlias');
    if (!hasSetJPushAlias) {
      JPushModule.setAlias(alias, (success) => {
        console.log('JPush', 'success', success);
        rnStorage.save('hasSetJPushAlias', true);
      });
    }
  } else {
    console.warn('setAlias failed: alias is required', alias);
  }
}

export function bindInfo(userUUID) {
  const registrationID = JPushModule.getRegistrationID();
  bindNotifyInfo({ userUUID, registrationID });
  setAlias(userUUID);
}
