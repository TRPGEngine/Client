import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useConverses } from '@redux/hooks/chat';
import { SidebarItem } from '../SidebarItem';
import { UserOutlined } from '@ant-design/icons';
import { Switch, Route, Redirect } from 'react-router-dom';
import { FriendPanel } from './FriendPanel';
import { SectionHeader } from '@web/components/SectionHeader';
import { UserConversePanel } from './UserConversePanel';
import {
  ContentContainer,
  Sidebar,
  ContentDetail,
  SidebarHeaderText,
  SidebarItemsContainer,
} from '../style';
import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import { SidebarHeader } from '../SidebarHeader';
import { NotePanel } from './NotePanel';

export const Personal: React.FC = TMemo((props) => {
  const converses = useConverses(['user']);
  const noteList = useTRPGSelector((state) => state.note.list);
  const handleAddNote = useCallback(() => {
    console.log('TODO: add note');
  }, []);

  return (
    <ContentContainer>
      <Sidebar>
        <SectionHeader />
        <SidebarItemsContainer>
          <SidebarItem
            icon={<UserOutlined style={{ color: 'white', fontSize: 24 }} />}
            name="好友"
            to="/main/personal/friends"
          />
          <SidebarHeader
            title="笔记"
            action={
              <i className="iconfont" onClick={handleAddNote}>
                &#xe604;
              </i>
            }
          />
          <div>
            {noteList.map((note) => {
              return (
                <SidebarItem
                  key={note.uuid}
                  icon=""
                  name={note.title}
                  to={`/main/personal/note/${note.uuid}`}
                />
              );
            })}
          </div>
          <SidebarHeaderText>私信</SidebarHeaderText>
          <div>
            {converses.map((converse) => {
              return (
                <SidebarItem
                  key={converse.uuid}
                  icon={converse.icon}
                  name={converse.name}
                  to={`/main/personal/converse/${converse.uuid}`}
                />
              );
            })}
          </div>
        </SidebarItemsContainer>
      </Sidebar>
      <ContentDetail>
        <Switch>
          <Route path="/main/personal/friends" component={FriendPanel} />
          <Route path="/main/personal/note/:noteUUID" component={NotePanel} />
          <Route
            path="/main/personal/converse/:converseUUID"
            component={UserConversePanel}
          />
          <Redirect to="/main/personal/friends" />
        </Switch>
      </ContentDetail>
    </ContentContainer>
  );
});
Personal.displayName = 'Personal';
