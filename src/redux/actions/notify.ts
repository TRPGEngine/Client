import rnStorage from '../../api/rn-storage.api';
import * as trpgApi from '../../api/trpg.api';
const api = trpgApi.getInstance();

type PlatformType = 'jpush' | 'upush';

interface NotifyInfo {
  userUUID: string;
  registrationID: string;
  platform: PlatformType;
}

const notifyEventNameMap = {
  jpush: 'notify::bindNotifyInfo',
  upush: 'notify::bindUPushNotifyInfo',
};

export const bindNotifyInfo = async (info: NotifyInfo) => {
  const platform = info.platform;
  const storageKey = 'hasBindNotifyInfo_' + platform;
  const hasBindNotifyInfo = await rnStorage.get(storageKey);
  if (!hasBindNotifyInfo) {
    const eventName = notifyEventNameMap[platform];
    api.emit(eventName, { info }, (data) => {
      if (data.result) {
        rnStorage.save(storageKey, true);
      }
    });
  }
};
