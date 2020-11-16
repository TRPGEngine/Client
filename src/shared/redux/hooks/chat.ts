import {
  useTRPGSelector,
  useTRPGDispatch,
} from '@shared/hooks/useTRPGSelector';
import {
  WritingListGroupItem,
  SimpleConverseType,
  ChatStateConverse,
} from '@redux/types/chat';
import { useMemo, useEffect } from 'react';
import _isNil from 'lodash/isNil';
import _orderBy from 'lodash/orderBy';
import _values from 'lodash/values';
import _mapValues from 'lodash/mapValues';
import _fromPairs from 'lodash/fromPairs';
import { useSystemSetting } from './settings';
import { useCurrentUserUUID } from './user';
import { switchConverse, clearSelectedConverse } from '@redux/actions/chat';

/**
 * 获取当前输入状态
 * @param converseUUID 会话UUID
 * @param type 会话类型
 */
export function useWritingState(converseUUID: string): WritingListGroupItem[] {
  const converse = useConverseDetail(converseUUID);
  const type = converse?.type;
  const currentUserUUID = useCurrentUserUUID();
  const showSelfInWritingState = useSystemSetting('showSelfInWritingState');

  if (_isNil(converseUUID)) {
    return [];
  }

  const writingList = useTRPGSelector((state) => {
    if (type === 'group') {
      return state.chat.writingList.group[converseUUID] ?? [];
    } else if (type === 'channel') {
      return state.chat.writingList.channel[converseUUID] ?? [];
    } else if (type === 'user') {
      // TODO: 先不处理用户会话
      return [];
    } else {
      // 未知类型
      return [];
    }
  });

  return useMemo(() => {
    if (showSelfInWritingState !== true) {
      // 从列表中过滤掉自己
      return writingList.filter((item) => item.uuid !== currentUserUUID);
    }

    return writingList;
  }, [writingList, currentUserUUID, showSelfInWritingState]);
}

/**
 * 获取会话中的消息列表
 * @param converseUUID 会话UUID
 */
export function useMsgList(
  converseUUID: string,
  order: 'asc' | 'desc' = 'asc'
) {
  const converse = useTRPGSelector(
    (state) => state.chat.converses[converseUUID]
  );
  const msgList = useMemo(() => {
    if (_isNil(converse?.msgList)) {
      return [];
    }
    return _orderBy(converse?.msgList, (item) => new Date(item.date), [order]);
  }, [converse?.msgList, order]);
  const nomore = converse?.nomore ?? false;

  return {
    list: msgList,
    nomore,
  };
}

/**
 * 返回会话列表
 * @param filterType 会话类型
 */
export function useConverses(
  filterType: SimpleConverseType[]
): ChatStateConverse[] {
  const converses = useTRPGSelector((state) => state.chat.converses);

  return useMemo(() => {
    return _values(converses).filter((converse) =>
      filterType.includes(converse.type as SimpleConverseType)
    );
  }, [converses, filterType]);
}

/**
 * 获取会话详情内容
 * @param converseUUID 会话UUID
 */
export function useConverseDetail(
  converseUUID: string
): ChatStateConverse | undefined {
  return useTRPGSelector((state) => state.chat.converses[converseUUID]);
}

export function useSelectConverse(converseUUID: string) {
  const dispatch = useTRPGDispatch();
  useEffect(() => {
    dispatch(switchConverse(converseUUID));

    return () => {
      dispatch(clearSelectedConverse());
    };
  }, [converseUUID]);
}

/**
 * 检查一个团是否有未读信息
 * @param groupUUID 团UUID
 */
export function useGroupUnread(
  groupUUIDs: string[]
): { [groupUUID: string]: boolean } {
  const groups = useTRPGSelector((state) => state.group.groups);
  const groupInfoMap = useMemo(
    () =>
      _mapValues(
        _fromPairs(groupUUIDs.map((uuid) => [uuid, uuid])),
        (groupUUID) => groups.find((g) => g.uuid === groupUUID)
      ),
    [groupUUIDs, groups]
  );

  const groupConversesMap = useMemo(
    () =>
      _mapValues(groupInfoMap, (groupInfo) => {
        if (_isNil(groupInfo)) {
          return [];
        }

        return [
          groupInfo.uuid,
          ...(groupInfo.channels ?? []).map((ch) => ch.uuid),
        ];
      }),
    [groupInfoMap]
  );

  const allConverses = useTRPGSelector((state) => state.chat.converses);
  const groupConversesUnreadMap = useMemo(
    () =>
      _mapValues(groupConversesMap, (converses) =>
        converses.some(
          (converseUUID) => allConverses[converseUUID]?.unread === true
        )
      ),
    [groupConversesMap, allConverses]
  );

  return groupConversesUnreadMap;
}
