import rnStorage from '../../api/rn-storage.api';
import * as trpgApi from '../../api/trpg.api';
const api = trpgApi.getInstance();

export const bindNotifyInfo = async (info) => {
  const hasBindNotifyInfo = await rnStorage.get('hasBindNotifyInfo');
  if (!hasBindNotifyInfo) {
    api.emit('notify::bindNotifyInfo', { info }, (data) => {
      if (data.result) {
        rnStorage.save('hasBindNotifyInfo', true);
      }
    });
  }
};
