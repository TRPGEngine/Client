import { getInstance } from '@shared/api/trpg.api';
import { TokenData } from './core/types';
const api = getInstance();

/**
 * map相关的路由复用主socket连接
 * 减少无意义的长连接
 */

let currentMapUUID: string;

/**
 * 加入地图的广播房间
 * @param mapUUID 地图UUID
 */
export async function joinMapRoom(mapUUID: string, jwt?: string) {
  const { mapData } = await api
    .emitP('trpg::joinMapRoom', {
      mapUUID,
      jwt,
    })
    .catch((msg) => {
      throw new Error('加入房间失败: ' + msg);
    });

  currentMapUUID = mapUUID;
  return mapData;
}

export type UpdateType = 'add' | 'update' | 'remove';
export interface UpdateTokenPayload {
  add: {
    jwt?: string;
    layerId: string;
    token: TokenData;
  };
  update: {
    jwt?: string;
    layerId: string;
    tokenId: string;
    tokenAttrs: TokenData;
  };
  remove: {
    jwt?: string;
    layerId: string;
    tokenId: string;
  };
}

export async function updateLayer(type: UpdateType, payload: {}) {
  return await api.emitP('trpg::updateMapLayer', {
    mapUUID: currentMapUUID,
    type,
    payload,
  });
}

export async function updateToken<T extends UpdateType>(
  type: T,
  payload: UpdateTokenPayload[T]
) {
  return await api.emitP('trpg::updateMapToken', {
    mapUUID: currentMapUUID,
    type,
    payload,
  });
}

/**
 * 注册地图Token事件监听器
 */
type MapTokenEventCallback = <T extends UpdateType>(
  type: T,
  payload: UpdateTokenPayload[T]
) => void;
export const registerMapTokenEventListener = (
  mapUUID: string,
  cb: MapTokenEventCallback
) => {
  api.on('trpg::updateMapToken', function(data) {
    const { type, payload } = data;

    if (data.mapUUID === mapUUID) {
      cb(type, payload);
    }
  });
};

/**
 * 注册地图连接人更新事件
 */
type MapConnectUpdateCallback = (socketIds: string[]) => void;
export function registerMapConnectsUpdate(
  mapUUID: string,
  cb: MapConnectUpdateCallback
) {
  api.on('trpg::updateMapConnects', function(data) {
    const { socketIds } = data;

    if (data.mapUUID === mapUUID) {
      cb(socketIds);
    }
  });
}
