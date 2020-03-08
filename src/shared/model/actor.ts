import memoizeOne from 'memoize-one';
import request from '@shared/utils/request';
import { ActorType } from '@redux/types/actor';

/**
 * 获取所有的共享角色
 */
export const fetchAllSharedActor = memoizeOne(
  async (): Promise<ActorType[]> => {
    const { data } = await request(`/actor/findAllSharedActor`);
    return data.actors ?? [];
  }
);
