import React, { useCallback, useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useConverses } from '@redux/hooks/chat';
import { SidebarItem } from '../SidebarItem';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Switch, Route, Redirect } from 'react-router-dom';
import { FriendPanel } from './FriendPanel';
import { SectionHeader } from '@web/components/SectionHeader';
import { UserConversePanel } from './UserConversePanel';
import { PageContent } from '../PageContent';
import { SidebarHeaderText, SidebarItemsContainer } from '../style';
import { useTRPGSelector, useTRPGDispatch } from '@redux/hooks/useTRPGSelector';
import { SidebarHeader } from '../SidebarHeader';
import { NotePanel } from './NotePanel';
import { Iconfont } from '@web/components/Iconfont';
import { createNote } from '@redux/actions/note';
import { ActorPanel } from './ActorPanel';
import { SYSTE_CONVERSE_SPEC } from '@shared/utils/consts';
import { Button, Col, Divider, Row } from 'antd';
import { useCurrentUserInfo } from '@redux/hooks/user';
import { getUserName } from '@shared/utils/data-helper';
import { useTranslation } from '@shared/i18n';
import { useHistory } from 'react-router';
import _orderBy from 'lodash/orderBy';
import { UserAvatar } from '@web/components/UserAvatar';
import { PortalAdd, PortalRemove } from '@web/utils/portal';
import { FullModal } from '@web/components/FullModal';
import { SettingView } from '../../Navbar/SettingView';
import { HoverRotator } from '@web/components/HoverRotator';
import {
  personalPanelContentList,
  personalPanelItemList,
} from '@web/reg/regPersonalPanel';

/**
 * 个人面板
 */
export const Personal: React.FC = TMemo(() => {
  const userConverses = useConverses(['user']);
  const systemConverse = useTRPGSelector(
    (state) => state.chat.converses[SYSTE_CONVERSE_SPEC]
  );
  const noteList = useTRPGSelector((state) => state.note.list);
  const orderedNoteList = useMemo(
    () => _orderBy(noteList, ['updatedAt'], ['desc']),
    [noteList]
  );
  const dispatch = useTRPGDispatch();
  const currentUserInfo = useCurrentUserInfo();
  const { t } = useTranslation();
  const history = useHistory();

  const handleAddNote = useCallback(() => {
    dispatch(
      createNote((noteUUID) => {
        history.push(`/main/personal/note/${noteUUID}`);
      })
    );
  }, [history]);

  const handleShowSetting = useCallback(() => {
    const key = PortalAdd(
      <FullModal visible={true} onChangeVisible={() => PortalRemove(key)}>
        <SettingView />
      </FullModal>
    );
  }, []);

  const sidebar = (
    <>
      <SectionHeader>
        <Row align="middle" justify="space-between">
          <Col>{getUserName(currentUserInfo)}</Col>
          <Col>
            <Button
              type="text"
              icon={
                <HoverRotator>
                  <SettingOutlined />
                </HoverRotator>
              }
              onClick={handleShowSetting}
            />
          </Col>
        </Row>
      </SectionHeader>
      <SidebarItemsContainer>
        <SidebarItem
          icon={<UserOutlined style={{ color: 'white', fontSize: 24 }} />}
          name={t('好友')}
          to="/main/personal/friends"
        />
        {...personalPanelItemList}
        <Divider />
        <SidebarItem
          name={t('系统消息')}
          to={`/main/personal/converse/${SYSTE_CONVERSE_SPEC}`}
          badge={systemConverse?.unread}
        />
        <SidebarHeader
          title={t('笔记')}
          action={
            <HoverRotator>
              <Iconfont onClick={handleAddNote}>&#xe604;</Iconfont>
            </HoverRotator>
          }
        />
        <div>
          {orderedNoteList.map((note) => {
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
                icon={<UserAvatar uuid={converse.uuid} />}
                name={converse.name}
                to={`/main/personal/converse/${converse.uuid}`}
                badge={converse.unread}
              />
            );
          })}
        </div>
      </SidebarItemsContainer>
    </>
  );

  return (
    <PageContent sidebar={sidebar}>
      <Switch>
        <Route path="/main/personal/friends" component={FriendPanel} />
        <Route path="/main/personal/note/:noteUUID" component={NotePanel} />
        <Route
          path="/main/personal/converse/:converseUUID"
          component={UserConversePanel}
        />

        {/* TODO */}
        <Route path="/main/personal/actors" component={ActorPanel} />
        {...personalPanelContentList}
        <Redirect to="/main/personal/friends" />
      </Switch>
    </PageContent>
  );
});
Personal.displayName = 'Personal';
