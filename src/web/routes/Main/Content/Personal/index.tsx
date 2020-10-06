import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useConverses } from '@redux/hooks/chat';
import { SidebarItem } from '../SidebarItem';
import { UserOutlined } from '@ant-design/icons';
import { Switch, Route, Redirect } from 'react-router-dom';
import { FriendPanel } from './FriendPanel';
import { SectionHeader } from '@web/components/SectionHeader';
import { UserConversePanel } from './UserConversePanel';
import { PageContent } from '../PageContent';
import { SidebarHeaderText, SidebarItemsContainer } from '../style';
import {
  useTRPGSelector,
  useTRPGDispatch,
} from '@shared/hooks/useTRPGSelector';
import { SidebarHeader } from '../SidebarHeader';
import { NotePanel } from './NotePanel';
import { Iconfont } from '@web/components/Iconfont';
import { createNote } from '@redux/actions/note';
import { ActorPanel } from './ActorPanel';
import { SYSTE_CONVERSE_SPEC } from '@shared/utils/consts';
import { Divider } from 'antd';
import { useCurrentUserInfo } from '@redux/hooks/user';
import { getUserName } from '@shared/utils/data-helper';
import { useTranslation } from '@shared/i18n';

/**
 * 个人面板
 */
export const Personal: React.FC = TMemo(() => {
  const userConverses = useConverses(['user']);
  const systemConverse = useTRPGSelector(
    (state) => state.chat.converses[SYSTE_CONVERSE_SPEC]
  );
  const noteList = useTRPGSelector((state) => state.note.list);
  const dispatch = useTRPGDispatch();
  const handleAddNote = useCallback(() => {
    dispatch(createNote());
  }, []);
  const currentUserInfo = useCurrentUserInfo();
  const { t } = useTranslation();

  return (
    <PageContent
      sidebar={
        <>
          <SectionHeader>{getUserName(currentUserInfo)}</SectionHeader>
          <SidebarItemsContainer>
            <SidebarItem
              icon={<UserOutlined style={{ color: 'white', fontSize: 24 }} />}
              name={t('好友')}
              to="/main/personal/friends"
            />
            <SidebarItem
              icon={
                <Iconfont style={{ color: 'white', fontSize: 24 }}>
                  &#xe61b;
                </Iconfont>
              }
              name={t('角色')}
              to="/main/personal/actors"
            />
            <Divider />
            <SidebarItem
              icon="系统消息"
              name={t('系统消息')}
              to={`/main/personal/converse/${SYSTE_CONVERSE_SPEC}`}
              badge={systemConverse?.unread}
            />
            <SidebarHeader
              title={t('笔记')}
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
            <SidebarHeaderText>{t('私信')}</SidebarHeaderText>
            <div>
              {userConverses.map((converse) => {
                return (
                  <SidebarItem
                    key={converse.uuid}
                    icon={converse.icon}
                    name={converse.name}
                    to={`/main/personal/converse/${converse.uuid}`}
                    badge={converse.unread}
                  />
                );
              })}
            </div>
          </SidebarItemsContainer>
        </>
      }
    >
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
    </PageContent>
  );
});
Personal.displayName = 'Personal';
