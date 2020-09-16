import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { SidebarView, SidebarViewMenuType } from '@web/components/SidebarView';
import { GroupInfoSummary } from './GroupInfoSummary';
import { useIsGroupManager, useJoinedGroupInfo } from '@redux/hooks/group';
import { GroupPanelManager } from './GroupPanelManager';
import { GroupActorManager } from './GroupActorManager';
import { useTranslation } from '@shared/i18n';

interface GroupInfoDetailProps {
  groupUUID: string;
}
export const GroupInfoDetail: React.FC<GroupInfoDetailProps> = TMemo(
  (props) => {
    const { groupUUID } = props;
    const groupInfo = useJoinedGroupInfo(groupUUID);
    const { t } = useTranslation();
    const isGroupManager = useIsGroupManager(groupUUID);

    const menu: SidebarViewMenuType[] = useMemo(
      () => [
        {
          type: 'group',
          title: groupInfo?.name ?? '',
          children: [
            {
              type: 'item',
              title: t('概况'),
              content: <GroupInfoSummary groupUUID={groupUUID} />,
            },
            {
              type: 'item',
              title: t('面板'),
              hidden: !isGroupManager,
              content: <GroupPanelManager groupUUID={groupUUID} />,
            },
            {
              type: 'item',
              title: t('人物卡管理'),
              content: <GroupActorManager groupUUID={groupUUID} />,
            },
          ],
        },
      ],
      [groupInfo?.name, groupUUID, t, isGroupManager]
    );

    return (
      <SidebarView defaultContentPath="0.children.0.content" menu={menu} />
    );
  }
);
GroupInfoDetail.displayName = 'GroupInfoDetail';
