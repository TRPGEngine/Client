import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import { GroupInfo, GroupActorType, GroupChannel } from '@redux/types/group';
import { useCurrentUserInfo, useCurrentUserUUID } from './user';
import _get from 'lodash/get';
import _uniq from 'lodash/uniq';
import _isNil from 'lodash/isNil';
import _without from 'lodash/without';
import { useMemo } from 'react';
import { GroupPanel } from '@shared/types/panel';
import { isGroupPanelVisible } from '@shared/helper/group';
import { useConverses } from './chat';

/**
 * @deprecated
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
 * 获取加入的团的信息
 * @param groupUUID 团UUID
 */
export function useJoinedGroupInfo(groupUUID: string): GroupInfo | undefined {
  const groupInfo = useTRPGSelector((state) =>
    state.group.groups.find((group) => group.uuid === groupUUID)
  );

  return groupInfo;
}

/**
 * 获取团成员列表
 * @param groupUUID 团UUID
 */
export function useGroupMemberUUIDs(groupUUID: string): string[] {
  const groupInfo = useJoinedGroupInfo(groupUUID);
  return groupInfo?.group_members ?? [];
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
 * 获取团管理员列表
 * @param groupUUID 团UUID
 */
export function useGroupManagerUUIDs(groupUUID: string): string[] {
  const group = useJoinedGroupInfo(groupUUID);
  if (_isNil(group)) {
    return [];
  }
  return _uniq([group.owner_uuid, ...group.managers_uuid!]);
}

/**
 * 获取团普通成员列表
 * @param groupUUID 团UUID
 */
export function useGroupNormalMembers(groupUUID: string): string[] {
  const group = useJoinedGroupInfo(groupUUID);
  if (_isNil(group)) {
    return [];
  }

  return _uniq(_without(group.group_members, ...(group.managers_uuid ?? [])));
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

/**
 * 获取团UUID列表
 * @param groupUUID 团UUID
 */
export function useGroupPanelList(groupUUID: string): GroupPanel[] {
  const currentUserUUID = useCurrentUserUUID();
  const groupInfo = useJoinedGroupInfo(groupUUID);
  const allPanels = groupInfo?.panels ?? [];

  return allPanels.filter((panel) => {
    return isGroupPanelVisible(groupInfo, panel, currentUserUUID);
  });
}

/**
 * 获取团面板相关信息
 * @param groupUUID 团UUID 必须是已加入的团
 * @param panelUUID 面板UUID
 */
export function useGroupPanelInfo(
  groupUUID: string,
  panelUUID: string
): GroupPanel | undefined {
  const groupInfo = useJoinedGroupInfo(groupUUID);
  const panelInfo = groupInfo?.panels?.find((p) => p.uuid === panelUUID);

  return panelInfo;
}

/**
 * 获取团的频道列表
 * @param groupUUID 团UUID
 */
export function useGroupChannel(groupUUID: string): GroupChannel[] {
  const groupInfo = useJoinedGroupInfo(groupUUID);
  const channels = groupInfo?.channels ?? [];

  return channels;
}

/**
 * 获取团所有未读消息列表
 * @param groupUUID 团UUID
 */
export function useGroupUnreadConverseList(groupUUID: string): string[] {
  const groupInfo = useJoinedGroupInfo(groupUUID);
  const converses = useConverses(['group', 'channel']);
  const allConverseUUID = useMemo(() => {
    return groupInfo?.channels?.map((channel) => channel.uuid) ?? [];
  }, [groupInfo?.channels]);

  const allUnreadConverseUUIDs = useMemo(() => {
    return converses
      .filter(
        (converse) =>
          converse.unread === true &&
          (converse.uuid === groupInfo?.uuid ||
            allConverseUUID.includes(converse.uuid))
      )
      .map((converse) => converse.uuid);
  }, [converses, allConverseUUID]);

  return allUnreadConverseUUIDs;
}
