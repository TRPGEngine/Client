import { buildCacheFactory, CachePolicy } from '@shared/utils/cache-factory';
import { request } from '@portal/utils/request';

export interface PlayerUser {
  id: number;
  name?: string;
  uuid: string;
  username: string;
  nickname: string;
  avatar: string;
  last_login: string;
  last_ip: string;
  sex: string;
  sign: string;
  alignment: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export const fetchUserInfo = buildCacheFactory<PlayerUser>(
  CachePolicy.Persistent,
  (uuid: string) => {
    return request.get(`/player/info/${uuid}`).then(({ data }) => data.user);
  }
);
