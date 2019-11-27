import { request } from '@portal/utils/request';

export interface GroupActorItem {
  uuid: string;
  actor_uuid: string;
  actor_info: {};
  actor_template_uuid: string;
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

export const fetchGroupActorDetail = async (
  groupActorUUID: string
): Promise<GroupActorItem> => {
  const { data } = await request.get(`/group/actor/detail/${groupActorUUID}`);

  return data.groupActor;
};

/**
 * 申请创建团角色
 * @param groupUUID 团UUID
 * @param actorUUID 人物UUID
 */
export const applyGroupActor = async (
  groupUUID: string,
  actorUUID: string
): Promise<GroupActorItem> => {
  const { data } = await request.post(`/group/${groupUUID}/actor/apply`, {
    actorUUID,
  });

  return data.actor;
};

/**
 * 同意团角色的申请
 * @param groupUUID 团UUID
 * @param groupActorUUID 团角色UUID
 */
export const agreeGroupActor = async (
  groupUUID: string,
  groupActorUUID: string
): Promise<GroupActorItem> => {
  const { data } = await request.post(`/group/${groupUUID}/actor/agree`, {
    groupActorUUID,
  });

  return data.groupActor;
};

/**
 * 拒绝团角色的申请
 * @param groupUUID 团UUID
 * @param groupActorUUID 团角色UUID
 */
export const refuseGroupActor = async (
  groupUUID: string,
  groupActorUUID: string
): Promise<void> => {
  await request.post(`/group/${groupUUID}/actor/refuse`, {
    groupActorUUID,
  });
};
