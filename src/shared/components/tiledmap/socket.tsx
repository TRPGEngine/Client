import { getInstance } from '@shared/api/trpg.api';
import { TokenAttrs, TokenData } from './core/types';
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
export async function joinMapRoom(mapUUID: string) {
  const { result, mapData } = await api.emitP('trpg::joinMapRoom', { mapUUID });

  if (result === false) {
    throw new Error('加入房间失败');
  }

  currentMapUUID = mapUUID;
  return mapData;
}

export type UpdateType = 'add' | 'update' | 'remove';
export interface UpdateTokenPayload {
  add: {
    layerId: string;
    token: TokenData;
  };
  update: {
    layerId: string;
    tokenId: string;
    tokenAttrs: TokenData;
  };
  remove: {
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
 * 注册地图事件监听器
 */
type MapEventCallback = <T extends UpdateType>(
  type: T,
  payload: UpdateTokenPayload[T]
) => void;
export const registerMapEventListener = (
  mapUUID: string,
  cb: MapEventCallback
) => {
  api.on('trpg::updateMapToken', function(data) {
    const { type, payload } = data;

    if (data.mapUUID === mapUUID) {
      cb(type, payload);
    }
  });
};
