import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { GroupInfo } from '@redux/types/group';
import { SidebarView, SidebarViewMenuType } from '@web/components/SidebarView';
import { FullModal } from '@web/components/FullModal';

interface GroupInfoDetailProps {
  groupInfo: GroupInfo;
}
export const GroupInfoDetail: React.FC<GroupInfoDetailProps> = TMemo(
  (props) => {
    const { groupInfo } = props;

    const menu: SidebarViewMenuType[] = useMemo(
      () => [
        {
          type: 'group',
          title: 'a',
          children: [
            {
              type: 'item',
              title: 'Test',
              content: <div>aaaa</div>,
            },
            {
              type: 'item',
              title: 'Test2',
              content: <div>aaaa</div>,
            },
          ],
        },
      ],
      []
    );

    return (
      <SidebarView defaultContentPath="0.children.0.content" menu={menu} />
    );
  }
);
GroupInfoDetail.displayName = 'GroupInfoDetail';
