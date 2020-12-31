import { API } from '@shared/api/socket-api';
import * as trpgApi from '../shared/api/trpg.api';

/**
 * This file just for DEBUG
 */

declare global {
  interface Window {
    trpg: {
      api: API;
    };
  }
}

window.trpg = {
  api: trpgApi.getInstance(),
};
