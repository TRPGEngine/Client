import rnStorage from '../../api/rnStorage.api.js';
import * as trpgApi from '../../api/trpg.api.js';
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
