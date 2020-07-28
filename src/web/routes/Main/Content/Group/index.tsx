import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ContentContainer, Sidebar, ContentDetail } from '../style';

export const Group: React.FC = TMemo(() => {
  return (
    <ContentContainer>
      <Sidebar>
        <div>aaa</div>
      </Sidebar>
      <ContentDetail>
        <div>bbb</div>
      </ContentDetail>
    </ContentContainer>
  );
});
Group.displayName = 'Group';
