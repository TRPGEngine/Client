import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import {
  ContentContainer,
  Sidebar,
  ContentDetail,
  SidebarItemsContainer,
} from '../style';
import { useParams } from 'react-router';
import { useJoinedGroupInfo } from '@redux/hooks/group';
import { SidebarItem } from '../SidebarItem';
import { Switch, Route, Redirect } from 'react-router-dom';
import { GroupPanel } from './GroupPanel';
import { GroupHeader } from './GroupHeader';
import { Result } from 'antd';
import _isNil from 'lodash/isNil';
import { GroupInfoContext } from '@shared/context/GroupInfoContext';

interface GroupParams {
  groupUUID: string;
}
export const Group: React.FC = TMemo(() => {
  const params = useParams<GroupParams>();
  const groupUUID = params.groupUUID;
  const groupInfo = useJoinedGroupInfo(groupUUID);

  if (_isNil(groupInfo)) {
    return (
      <div style={{ flex: 1 }}>
        <Result status="warning" title="找不到该团" />
      </div>
    );
  }

  const panels = groupInfo.panels ?? [];

  return (
    <GroupInfoContext.Provider value={groupInfo}>
      <ContentContainer>
        <Sidebar>
          <GroupHeader groupUUID={groupUUID} />
          <SidebarItemsContainer>
            <SidebarItem
              name="综合"
              icon={<span>#</span>}
              to={`/main/group/${groupUUID}/main`}
            />

            {panels.map((panel) => (
              <SidebarItem
                key={panel.uuid}
                name={panel.name}
                icon={<span>#</span>}
                to={`/main/group/${groupUUID}/${panel.uuid}`}
              />
            ))}
          </SidebarItemsContainer>
        </Sidebar>
        <ContentDetail>
          <Switch>
            <Route
              path="/main/group/:groupUUID/:panelUUID"
              component={GroupPanel}
            />
            <Redirect to={`/main/group/${groupUUID}/main`} />
          </Switch>
        </ContentDetail>
      </ContentContainer>
    </GroupInfoContext.Provider>
  );
});
Group.displayName = 'Group';
