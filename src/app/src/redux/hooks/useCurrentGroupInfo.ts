import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import { GroupInfo } from '@redux/types/group';

/**
 * 根据state.group.selectedGroupUUID获取当前团的信息
 */
export function useCurrentGroupInfo(): GroupInfo | null {
  const groupInfo = useTRPGSelector((state) =>
    state.group.groups.find((g) => g.uuid === state.group.selectedGroupUUID)
  );

  return groupInfo;
}
