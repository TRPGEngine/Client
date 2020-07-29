import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ContentContainer, Sidebar, ContentDetail } from '../style';
import { useParams } from 'react-router';
import { SectionHeader } from '@web/components/SectionHeader';
import { useJoinedGroupInfo } from '@redux/hooks/group';
import { SidebarItem } from '../SidebarItem';
import { Switch, Route, Redirect } from 'react-router-dom';
import { GroupPanel } from './GroupPanel';

interface GroupParams {
  groupUUID: string;
}
export const Group: React.FC = TMemo(() => {
  const params = useParams<GroupParams>();
  const groupUUID = params.groupUUID;
  const groupInfo = useJoinedGroupInfo(groupUUID);

  return (
    <ContentContainer>
      <Sidebar>
        <SectionHeader>{groupInfo?.name}</SectionHeader>
        <SidebarItem
          name="综合"
          icon={<span>#</span>}
          to={`/main/group/${groupUUID}/main`}
        />
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
  );
});
Group.displayName = 'Group';
