import rnStorage from '../../api/rn-storage.api';
import * as trpgApi from '../../api/trpg.api';
const api = trpgApi.getInstance();

type PlatformType = 'jpush' | 'upush';

interface NotifyInfo {
  userUUID: string;
  registrationID: string;
  platform: PlatformType;
}

export const bindNotifyInfo = async (info: NotifyInfo) => {
  const platform = info.platform;
  const storageKey = 'hasBindNotifyInfo_' + platform;
  const hasBindNotifyInfo = await rnStorage.get(storageKey);
  if (!hasBindNotifyInfo) {
    api.emit('notify::bindNotifyInfo', { info }, (data) => {
      if (data.result) {
        rnStorage.save(storageKey, true);
      }
    });
  }
};
