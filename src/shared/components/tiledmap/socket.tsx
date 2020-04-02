import { getInstance } from '@shared/api/trpg.api';
const api = getInstance();

/**
 * map相关的路由复用主socket连接
 * 减少无意义的长连接
 */

/**
 * 加入地图的广播房间
 * @param mapUUID 地图UUID
 */
export async function joinMapRoom(mapUUID: string) {
  return await api.emitP('trpg::joinMapRoom', { mapUUID });
}

type UpdateTokenType = 'add' | 'update' | 'remove';
export async function updateToken(type: UpdateTokenType, payload: {}) {
  return await api.emitP('trpg::updateMapToken', { type, payload });
}
