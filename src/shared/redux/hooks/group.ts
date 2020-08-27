import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import { GroupInfo, GroupActorType } from '@redux/types/group';
import { useCurrentUserInfo } from './user';
import _get from 'lodash/get';
import _uniq from 'lodash/uniq';
import _isNil from 'lodash/isNil';
import { useMemo } from 'react';

/**
 * 获取当前选择的团信息
 */
export function useSelectedGroupInfo(): GroupInfo | null {
  return useTRPGSelector((state) => {
    const selectedGroupUUID = state.group.selectedGroupUUID;

    return (
      state.group.groups.find((group) => group.uuid === selectedGroupUUID) ??
      null
    );
  });
}

/**
 * 获取当前加入的团的信息
 * @param groupUUID 团UUID
 */
export function useJoinedGroupInfo(groupUUID: string): GroupInfo | undefined {
  const groupInfo = useTRPGSelector((state) =>
    state.group.groups.find((group) => group.uuid === groupUUID)
  );

  return groupInfo;
}

/**
 * 获取属于自己的团角色信息列表
 */
export function useSelfGroupActors(groupUUID: string): GroupActorType[] {
  const userInfo = useCurrentUserInfo();
  const groupInfo = useJoinedGroupInfo(groupUUID);
  const selfGroupActors = (groupInfo?.group_actors || []).filter(
    (i) => i.enabled && i.passed && i.owner?.uuid === userInfo.uuid
  );

  return selfGroupActors;
}

/**
 * 获取选中的团角色的UUID
 */
export function useSelectedGroupActorUUID(
  groupUUID: string
): string | undefined {
  const groupInfo = useJoinedGroupInfo(groupUUID);
  return _get(groupInfo, ['extra', 'selected_group_actor_uuid']);
}

/**
 * 获取选中角色的信息
 * @param groupUUID 团UUID
 */
export function useSelectedGroupActorInfo(
  groupUUID: string
): GroupActorType | undefined {
  const selectedGroupActorUUID = useSelectedGroupActorUUID(groupUUID);
  const selfGroupActors = useSelfGroupActors(groupUUID);

  const selectedGroupActorInfo = useMemo(() => {
    if (typeof selectedGroupActorUUID === 'undefined') {
      return undefined;
    }

    return selfGroupActors.find(
      (actor) => actor.uuid === selectedGroupActorUUID
    );
  }, [selfGroupActors, selectedGroupActorUUID]);

  return selectedGroupActorInfo;
}

/**
 * 获取团UUID管理员列表
 * @param groupUUID 团UUID
 */
export function useGroupManagerUUIDs(groupUUID: string): string[] {
  const group = useTRPGSelector((state) =>
    state.group.groups.find((g) => g.uuid === groupUUID)
  );
  if (_isNil(group)) {
    return [];
  }
  return _uniq([group.owner_uuid, ...group.managers_uuid!]);
}

/**
 * 检测一个用户是否是团管理员
 * @param groupUUID 团UUID
 * @param playerUUID 用户UUID, 如果为空则为当前用户的UUID
 */
export function useIsGroupManager(
  groupUUID: string,
  playerUUID?: string
): boolean {
  const currentUserInfo = useCurrentUserInfo();
  const managers = useGroupManagerUUIDs(groupUUID);

  return managers.includes(playerUUID ?? currentUserInfo.uuid!);
}
