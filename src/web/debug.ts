import { login } from '@redux/actions/user';
import type { API } from '@shared/api/socket-api';
import * as trpgApi from '../shared/api/trpg.api';

/**
 * This file just for DEBUG
 */

declare global {
  interface Window {
    trpg: {
      api: API;
      quicklogin: (username: string, password: string) => void;
    };
  }
}

window.trpg = {
  api: trpgApi.getInstance(),
  quicklogin(username: string, password: string) {
    window.store.dispatch(login(username, password, { from: 'debug' }));
  },
};
