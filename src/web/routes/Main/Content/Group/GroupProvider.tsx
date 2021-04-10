import React, { useMemo } from 'react';
import { GroupInfoContext } from '@shared/context/GroupInfoContext';
import type { GroupInfo } from '@redux/types/group';
import { TMemo } from '@shared/components/TMemo';
import { useCachedUserInfoList } from '@redux/hooks/useCache';
import {
  EditorMentionListContext,
  EditorMentionListItem,
} from '@web/components/editor/context/EditorMentionListContext';
import { getUserName } from '@shared/utils/data-helper';

/**
 * 所有的团上下文提供器
 */

interface GroupProviderProps {
  groupInfo: GroupInfo;
}
export const GroupProvider: React.FC<GroupProviderProps> = TMemo((props) => {
  const { groupInfo } = props;
  const members = groupInfo.group_members ?? [];
  const cachedUserInfoList = useCachedUserInfoList(members);

  const mentionList: EditorMentionListItem[] = useMemo(() => {
    return (
      Object.values(cachedUserInfoList).map((item) => ({
        uuid: item.uuid,
        text: getUserName(item),
      })) ?? []
    );
  }, [cachedUserInfoList]);

  return (
    <GroupInfoContext.Provider value={groupInfo}>
      <EditorMentionListContext.Provider value={mentionList}>
        {props.children}
      </EditorMentionListContext.Provider>
    </GroupInfoContext.Provider>
  );
});
GroupProvider.displayName = 'GroupProvider';
