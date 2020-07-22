import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { useConverses } from '@redux/hooks/chat';
import { SidebarItem } from '../SidebarItem';
import { UserOutlined } from '@ant-design/icons';
import { PersonalSection } from './PersonalSection';
import { Switch, Route } from 'react-router-dom';
import { FriendPanel } from './FriendPanel';

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

export const Personal: React.FC = TMemo((props) => {
  const converses = useConverses(['user']);

  return (
    <Container>
      <Sidebar>
        <PersonalSection />
        <SidebarItemsContainer>
          <SidebarItem
            icon={<UserOutlined style={{ color: 'white', fontSize: 24 }} />}
            name="好友"
            to="/main/personal"
          />
          <SidebarHeaderText>私信</SidebarHeaderText>
          <div>
            {converses.map((converse) => {
              return (
                <SidebarItem
                  key={converse.uuid}
                  icon={converse.icon}
                  name={converse.name}
                  to={`/main/personal/${converse.uuid}`}
                />
              );
            })}
          </div>
        </SidebarItemsContainer>
      </Sidebar>
      <DetailContent>
        <Switch>
          <Route path="/main/personal/:converseUUID">
            <PersonalSection>标题</PersonalSection>
            <div>详情内容</div>
          </Route>
          <Route path="/main/personal/" component={FriendPanel} />
        </Switch>
      </DetailContent>
    </Container>
  );
});
Personal.displayName = 'Personal';
