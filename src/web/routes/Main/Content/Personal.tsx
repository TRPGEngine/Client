import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { useConverses } from '@redux/hooks/chat';
import { SidebarItem } from './SidebarItem';

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Sidebar = styled.div`
  width: ${(props) => props.theme.style.sidebarWidth};
  background-color: ${(props) => props.theme.style.sidebarBackgroundColor};
`;

const DetailContent = styled.div`
  flex: 1;
  background-color: ${(props) => props.theme.style.contentBackgroundColor};
`;

interface PersonalProps {}
export const Personal: React.FC<PersonalProps> = TMemo((props) => {
  const {} = props;
  const converses = useConverses(['user']);

  return (
    <Container>
      <Sidebar>
        <div>好友</div>
        <div>私信</div>
        <div>
          {converses.map((converse) => {
            return (
              <SidebarItem
                key={converse.uuid}
                icon={converse.icon}
                name={converse.name}
              />
            );
          })}
        </div>
      </Sidebar>
      <DetailContent>
        <div>详情内容</div>
      </DetailContent>
    </Container>
  );
});
Personal.displayName = 'Personal';
