import { getInstance } from '@shared/api/trpg.api';
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
  const { result } = await api.emitP('trpg::joinMapRoom', { mapUUID });
  if (result === true) {
    currentMapUUID = mapUUID;
  }
}

type UpdateType = 'add' | 'update' | 'remove';

export async function updateLayer(type: UpdateType, payload: {}) {
  return await api.emitP('trpg::updateMapLayer', {
    mapUUID: currentMapUUID,
    type,
    payload,
  });
}

export async function updateToken(type: UpdateType, payload: {}) {
  return await api.emitP('trpg::updateMapToken', {
    mapUUID: currentMapUUID,
    type,
    payload,
  });
}
