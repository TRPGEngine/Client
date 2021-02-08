import { request } from '@portal/utils/request';
import _get from 'lodash/get';
import _set from 'lodash/set';
import _isNil from 'lodash/isNil';
import _isString from 'lodash/isString';
import type { ModelAccess } from './types';
import type { GroupActorItem, GroupItem } from '@shared/model/group';
import type { ChatLogItem } from '@shared/model/chat';

/**
 * 获取自己拥有的所有团
 */
export async function fetchOwnGroupList(): Promise<GroupItem[]> {
  const { data } = await request.get('/group/list/own');

  return data.groups;
}

/**
 * 获取一定时间内所有的团会话
 * @param groupUUID 团UUID
 * @param converseUUID 会话UUID
 * @param from 开始时间
 * @param to 结束时间
 */
export async function fetchGroupRangeChatLog(
  groupUUID: string,
  converseUUID: string | null,
  from: string,
  to: string
): Promise<ChatLogItem[]> {
  const { data } = await request.get(`/group/log/${groupUUID}/range`, {
    params: { converseUUID, from, to },
  });

  return data.logs;
}

export const fetchGroupActorList = async (
  groupUUID: string
): Promise<GroupActorItem[]> => {
  const { data } = await request.get(`/group/${groupUUID}/actor/list`);

  return data.list;
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
 * 删除团人物卡
 * @param actorUUID 团人物卡UUID
 */
export const removeGroupActor = (groupUUID: string, groupActorUUID: string) => {
  return request.post(`/group/${groupUUID}/actor/${groupActorUUID}/remove`);
};

export const fetchGroupActorAccess = async (
  groupUUID: string,
  groupActorUUID: string
): Promise<ModelAccess> => {
  const { data } = await request.get(
    `/group/${groupUUID}/actor/${groupActorUUID}/access`
  );

  return data.access;
};
