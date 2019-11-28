import { request } from '@portal/utils/request';
import _get from 'lodash/get';
import _set from 'lodash/set';
import _isNil from 'lodash/isNil';
import _isString from 'lodash/isString';
import { toGroupActorWithBlobUrl } from '@web/utils/upload-helper';
import { getJWTInfo } from '@portal/utils/auth';
import { isBlobUrl } from '@shared/utils/string-helper';
import { bindFileAvatarAttachUUID } from './file';
import { ActorItem } from './actor';
import { ModelAccess } from './types';

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

/**
 * 编辑团角色信息
 * @param groupUUID 团UUID
 * @param groupActorUUID 团角色UUID
 * @param groupActorInfo 团角色信息
 */
export const editGroupActor = async (
  groupUUID: string,
  groupActorUUID: string,
  groupActorInfo: { [key: string]: any }
): Promise<GroupActorItem> => {
  // 头像的修改与绑定
  const avatarUrl = _get(groupActorInfo, '_avatar');
  let avatar;
  if (_isString(avatarUrl) && isBlobUrl(avatarUrl)) {
    const userInfo = getJWTInfo();
    avatar = await toGroupActorWithBlobUrl(userInfo.uuid, avatarUrl);
    _set(groupActorInfo, '_avatar', avatar.url);
  }

  const { data } = await request.post(
    `/group/${groupUUID}/actor/${groupActorUUID}/edit`,
    {
      info: groupActorInfo,
    }
  );

  const groupActor: GroupActorItem = data.groupActor;

  if (!_isNil(avatar)) {
    // 如果有头像， 则绑定头像关系
    await bindFileAvatarAttachUUID(avatar.uuid, groupActor.uuid);
  }

  return groupActor;
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
