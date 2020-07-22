import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { useConverses } from '@redux/hooks/chat';
import { SidebarItem } from '../SidebarItem';
import { UserOutlined } from '@ant-design/icons';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const Sidebar = styled.div`
  width: ${(props) => props.theme.style.sidebarWidth};
  background-color: ${(props) => props.theme.style.sidebarBackgroundColor};
`;

const SidebarItemsContainer = styled.div`
  padding: 0 8px;
`;

const SidebarHeaderText = styled.div`
  display: flex;
  padding: 10px;
  height: 40px;
`;

const DetailContent = styled.div`
  flex: 1;
  background-color: ${(props) => props.theme.style.contentBackgroundColor};
  display: flex;
  flex-direction: column;
`;

const PersonalSection = styled.div`
  height: ${(props) => props.theme.style.sectionHeight};
  position: relative;

  &::after {
    content: ' ';
    position: absolute;
    display: block;
    bottom: 1px;
    left: 0;
    right: 0;
    height: 1px;
    box-shadow: ${(props) => props.theme.boxShadow.elevationLow};
    z-index: 1;
    pointer-events: none;
  }
`;

export const Personal: React.FC = TMemo((props) => {
  const converses = useConverses(['user']);

  return (
    <Container>
      <Sidebar>
        <PersonalSection />
        <SidebarItemsContainer>
          <SidebarItem
            icon={<UserOutlined style={{ fontSize: 24 }} />}
            name="好友"
          />
          <SidebarHeaderText>私信</SidebarHeaderText>
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
        </SidebarItemsContainer>
      </Sidebar>
      <DetailContent>
        <PersonalSection>标题</PersonalSection>
        <div>详情内容</div>
      </DetailContent>
    </Container>
  );
});
Personal.displayName = 'Personal';
