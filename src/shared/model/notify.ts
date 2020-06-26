import rnStorage from '../api/rn-storage.api';
import * as trpgApi from '../api/trpg.api';
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

/**
 * 绑定当前设备与用户信息
 * 如果当前设备不存在绑定信息或绑定信息非当前登录用户(即用户在同一设备切换了账号)，则向远程发起绑定请求
 * @param info 绑定信息
 */
export const bindNotifyInfo = async (info: NotifyInfo) => {
  const userUUID = info.userUUID;
  const platform = info.platform;
  const storageKey = 'hasBindNotifyInfo_' + platform;
  const bindNotifyUserUUID = await rnStorage.get(storageKey);
  if (!bindNotifyUserUUID || bindNotifyUserUUID !== userUUID) {
    // 如果当前绑定记录不存在或者绑定用户UUID不匹配。则发起重新绑定
    const eventName = notifyEventNameMap[platform];
    api.emit(eventName, { ...info }, (data) => {
      if (data.result) {
        rnStorage.save(storageKey, userUUID);
      }
    });
  }
};
