import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import { WritingListGroupItem, ConverseType } from '@redux/types/chat';

/**
 * 获取当前输入状态
 * @param converseUUID 会话UUID
 * @param type 会话类型
 */
export function useWritingState(
  converseUUID: string,
  type: ConverseType = 'group'
): WritingListGroupItem[] {
  return useTRPGSelector((state) => {
    if (type === 'group') {
      return state.chat.writingList.group[converseUUID] ?? [];
    } else {
      // TODO: 先不处理
      return [];
    }
  });
}

/**
 * 获取团当前输入状态列表
 * @param groupUUID 团UUID
 */
export function useGroupWritingState(
  groupUUID: string
): WritingListGroupItem[] {
  return useWritingState(groupUUID, 'group');
}
