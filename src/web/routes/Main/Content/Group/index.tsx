import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { PageContent } from '../PageContent';
import { SidebarItemsContainer } from '../style';
import { useParams } from 'react-router';
import {
  useGroupPanelList,
  useGroupUnreadConverseList,
  useJoinedGroupInfo,
} from '@redux/hooks/group';
import { SidebarItem } from '../SidebarItem';
import { Switch, Route, Redirect } from 'react-router-dom';
import { GroupPanel } from './GroupPanel';
import { GroupHeader } from './GroupHeader';
import { Result } from 'antd';
import _isNil from 'lodash/isNil';
import { GroupProvider } from './GroupProvider';
import { useTranslation } from '@shared/i18n';

interface GroupParams {
  groupUUID: string;
}
export const Group: React.FC = TMemo(() => {
  const params = useParams<GroupParams>();
  const groupUUID = params.groupUUID;
  const groupInfo = useJoinedGroupInfo(groupUUID);
  const panels = useGroupPanelList(groupUUID);
  const unreadConverseList = useGroupUnreadConverseList(groupUUID);
  const { t } = useTranslation();

  if (_isNil(groupInfo)) {
    return (
      <div style={{ flex: 1 }}>
        <Result status="warning" title={t('找不到该团')} />
      </div>
    );
  }

  return (
    <GroupProvider groupInfo={groupInfo}>
      <PageContent
        sidebar={
          <>
            <GroupHeader groupUUID={groupUUID} />
            <SidebarItemsContainer>
              <SidebarItem
                name={t('大厅')}
                icon={<span>#</span>}
                to={`/main/group/${groupUUID}/lobby`}
                badge={unreadConverseList.includes(groupUUID)}
              />

              {panels.map((panel) => (
                <SidebarItem
                  key={panel.uuid}
                  name={panel.name}
                  icon={<span>#</span>}
                  to={`/main/group/${groupUUID}/${panel.uuid}`}
                  badge={
                    panel.type === 'channel' &&
                    unreadConverseList.includes(panel.target_uuid)
                  }
                />
              ))}
            </SidebarItemsContainer>
          </>
        }
      >
        <Switch>
          <Route
            path="/main/group/:groupUUID/:panelUUID"
            component={GroupPanel}
          />
          <Redirect to={`/main/group/${groupUUID}/lobby`} />
        </Switch>
      </PageContent>
    </GroupProvider>
  );
});
Group.displayName = 'Group';
