import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ContentContainer, Sidebar, ContentDetail } from '../style';
import { useParams } from 'react-router';
import { SectionHeader } from '@web/components/SectionHeader';
import { useJoinedGroupInfo } from '@redux/hooks/group';

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
        <div>aaa</div>
      </Sidebar>
      <ContentDetail>
        <div>bbb</div>
      </ContentDetail>
    </ContentContainer>
  );
});
Group.displayName = 'Group';
