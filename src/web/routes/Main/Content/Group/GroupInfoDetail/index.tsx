import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { SidebarView, SidebarViewMenuType } from '@web/components/SidebarView';
import { GroupInfoSummary } from './GroupInfoSummary';
import { useJoinedGroupInfo } from '@redux/hooks/group';

interface GroupInfoDetailProps {
  groupUUID: string;
}
export const GroupInfoDetail: React.FC<GroupInfoDetailProps> = TMemo(
  (props) => {
    const { groupUUID } = props;
    const groupInfo = useJoinedGroupInfo(groupUUID);

    const menu: SidebarViewMenuType[] = useMemo(
      () => [
        {
          type: 'group',
          title: groupInfo?.name ?? '',
          children: [
            {
              type: 'item',
              title: '概况',
              content: <GroupInfoSummary groupUUID={groupUUID} />,
            },
            {
              type: 'item',
              title: 'Test2',
              content: <div>aaaa</div>,
            },
          ],
        },
      ],
      [groupInfo?.name, groupUUID]
    );

    return (
      <SidebarView defaultContentPath="0.children.0.content" menu={menu} />
    );
  }
);
GroupInfoDetail.displayName = 'GroupInfoDetail';
