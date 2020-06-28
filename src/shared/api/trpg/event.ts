import * as trpgApi from '../trpg.api';
const api = trpgApi.getInstance();
import { buildCacheFactory, CachePolicy } from '@shared/utils/cache-factory';
import { PlayerTokenInfo } from '@shared/types/player';

/**
 * 获取MapMemberSocketInfo的信息
 */
export const getMapMemberSocketInfo = buildCacheFactory<PlayerTokenInfo | null>(
  CachePolicy.Temporary,
  async (socketId: string): Promise<PlayerTokenInfo | null> => {
    const { info } = await api.emitP('trpg::getMapMemberSocketInfo', {
      socketId,
    });

    return info;
  }
);
