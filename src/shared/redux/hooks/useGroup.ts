import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import { GroupInfo, GroupActorType } from '@redux/types/group';
import { useCurrentUserInfo } from './useUser';
import _get from 'lodash/get';

/**
 * 获取当前加入的团的信息
 * @param groupUUID 团UUID
 */
export function useJoinedGroupInfo(groupUUID: string): GroupInfo | null {
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
 * 获取当前选中的团角色的UUID
 */
export function useCurrentSelectedGroupActorUUID(
  groupUUID: string
): string | undefined {
  const groupInfo = useJoinedGroupInfo(groupUUID);
  return _get(groupInfo, ['extra', 'selected_group_actor_uuid']);
}
