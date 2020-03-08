import memoizeOne from 'memoize-one';
import request from '@shared/utils/request';
import { ActorType } from '@redux/types/actor';
import { PaginationType } from '@shared/types/query';

/**
 * 获取所有的共享角色
 */
export const fetchSharedActor = memoizeOne(
  async (templateUUID = '', page = 1): Promise<PaginationType<ActorType>> => {
    const { data } = await request(`/actor/findSharedActor`, 'get', {
      templateUUID,
      page,
    });
    return data;
  }
);
