import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { SidebarView, SidebarViewMenuType } from '@web/components/SidebarView';
import { GroupInfoSummary } from './GroupInfoSummary';
import { useIsGroupManager, useJoinedGroupInfo } from '@redux/hooks/group';
import { GroupPanelManage } from './GroupPanelManage';
import { useTranslation } from '@shared/i18n';
import { GroupMemberManage } from './GroupMemberManage';
import { GroupBotManage } from './GroupBotManage';
import { GroupDetailSettings } from './GroupDetailSettings';
import { groupInfoMenuList } from '@web/reg/regGroupInfoMenu';
import { GroupInfoContext } from '@shared/context/GroupInfoContext';
import { Result } from 'antd';

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
              content: <GroupPanelManage groupUUID={groupUUID} />,
            },
            {
              type: 'item',
              title: t('团设置'),
              hidden: !isGroupManager,
              content: <GroupDetailSettings groupUUID={groupUUID} />,
            },
            {
              type: 'item',
              title: t('成员管理'),
              hidden: !isGroupManager,
              content: <GroupMemberManage groupUUID={groupUUID} />,
            },
            {
              type: 'item',
              title: t('机器人管理'),
              hidden: !isGroupManager,
              content: <GroupBotManage groupUUID={groupUUID} />,
            },
            ...groupInfoMenuList,
          ],
        },
      ],
      [groupInfo?.name, groupUUID, t, isGroupManager]
    );

    if (groupInfo === undefined) {
      return <Result status="warning" title={t('找不到相关信息')} />;
    }

    return (
      <GroupInfoContext.Provider value={groupInfo}>
        <SidebarView defaultContentPath="0.children.0.content" menu={menu} />
      </GroupInfoContext.Provider>
    );
  }
);
GroupInfoDetail.displayName = 'GroupInfoDetail';
