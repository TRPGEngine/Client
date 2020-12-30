import { useCallback, useState } from 'react';

/**
 * 消息历史
 * 每个会话分别存储消息历史
 * @param converseUUID 会话UUID
 */
const msgHistoryMap = new Map<string, string[]>();

export function useMsgHistory(converseUUID: string) {
  const [index, setIndex] = useState(-1);
  const addHistoryMsg = useCallback(
    (msg: string) => {
      const arr = msgHistoryMap.get(converseUUID) ?? [];
      arr.push(msg);
      msgHistoryMap.set(converseUUID, arr);
    },
    [converseUUID]
  );

  /**
   * 从最远切换到最近
   */
  const switchDown = useCallback((): string | null => {
    const list = msgHistoryMap.get(converseUUID) ?? [];
    if (list.length === 0) {
      return null;
    }
    const newIndex = index >= list.length - 1 ? 0 : index + 1;
    setIndex(newIndex);

    return list[newIndex] ?? null;
  }, [converseUUID, index]);

  /**
   * 从最近切换到最远
   */
  const switchUp = useCallback((): string | null => {
    const list = msgHistoryMap.get(converseUUID) ?? [];
    if (list.length === 0) {
      return null;
    }

    const newIndex = index <= 0 ? list.length - 1 : index - 1;
    setIndex(newIndex);

    return list[newIndex] ?? null;
  }, [converseUUID, index]);

  const resetIndex = useCallback(() => {
    setIndex(-1);
  }, []);

  return {
    addHistoryMsg,
    switchUp,
    switchDown,
    currentIndex: index,
    resetIndex,
  };
}
