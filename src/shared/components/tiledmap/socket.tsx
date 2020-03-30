import { getInstance } from '@shared/api/trpg.api';

/**
 * map相关的路由复用主socket连接
 * 减少无意义的长连接
 */

/**
 * 加入地图的广播房间
 * @param mapUUID 地图UUID
 */
export async function joinMapRoom(mapUUID: string) {
  const api = getInstance();
  return await api.emitP('trpg::joinMapRoom', { mapUUID });
}
