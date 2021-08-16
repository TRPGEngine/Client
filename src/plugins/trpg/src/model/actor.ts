import { request } from '@capital/shared/utils/request';
// import type { ActorType } from '@redux/types/actor';
import type { PaginationType } from '@capital/shared/types/query';

/**
 * 获取所有的共享角色
 */
export const fetchSharedActor = async (
  templateUUID = '',
  page = 1
): Promise<PaginationType</* ActorType */ any>> => {
  const { data } = await request.get('/actor/findSharedActor', {
    params: {
      templateUUID,
      page,
    },
  });
  return data;
};
