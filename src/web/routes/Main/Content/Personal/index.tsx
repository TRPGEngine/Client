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
import {
  useTRPGSelector,
  useTRPGDispatch,
} from '@shared/hooks/useTRPGSelector';
import { SidebarHeader } from '../SidebarHeader';
import { NotePanel } from './NotePanel';
import { Iconfont } from '@web/components/Iconfont';
import { createNote } from '@redux/actions/note';
import { ActorPanel } from './ActorPanel';

export const Personal: React.FC = TMemo(() => {
  const converses = useConverses(['user']);
  const noteList = useTRPGSelector((state) => state.note.list);
  const dispatch = useTRPGDispatch();
  const handleAddNote = useCallback(() => {
    dispatch(createNote());
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
          <SidebarItem
            icon={
              <Iconfont style={{ color: 'white', fontSize: 24 }}>
                &#xe61b;
              </Iconfont>
            }
            name="角色"
            to="/main/personal/actors"
          />
          <SidebarHeader
            title="笔记"
            action={<Iconfont onClick={handleAddNote}>&#xe604;</Iconfont>}
          />
          <div>
            {noteList.map((note) => {
              return (
                <SidebarItem
                  key={note.uuid}
                  icon=""
                  name={note.title}
                  to={`/main/personal/note/${note.uuid}`}
                  badge={note.unsync}
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
          <Route path="/main/personal/actors" component={ActorPanel} />
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
