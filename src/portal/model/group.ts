import { request } from '@portal/utils/request';

export interface GroupActorItem {
  uuid: string;
  actor_uuid: string;
  actor_info: {};
  name: string;
  desc: string;
  avatar: string;
  passed: boolean;
  enabled: boolean;
}

export const fetchGroupActorList = async (
  groupUUID: string
): Promise<GroupActorItem[]> => {
  const { data } = await request.get(`/group/${groupUUID}/actor/list`);

  return data.list;
};
