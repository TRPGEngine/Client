import React from 'react';
import {
  regPersonalPanelItem,
  regPersonalPanelContent,
} from '@capital/web/reg/regPersonalPanel';
import { regMessageCard } from '@capital/web/reg/regMessageCard';
import { regMsgSenderPopover } from '@capital/web/reg/regMsgSenderPopover';
import { regGroupInfoMenu } from '@capital/web/reg/regGroupInfoMenu';
import { SidebarItem } from '@capital/web/routes/Main/Content/SidebarItem';
import { Iconfont } from '@capital/web/components/Iconfont';
import { t } from '@capital/shared/i18n';
import { Route } from 'react-router';
import { TLoadable } from '@capital/web/components/TLoadable';
import { subscribeToUserLoginSuccess } from '@capital/shared/manager/userState';
import { dispatchAction } from '@capital/shared/redux/configureStore/helper';
import { getTemplate, getActor } from './redux/actions/actor';
import Actor from './components/messageTypes/card/Actor';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import PopoverGroupActorInfo from './components/popover/GroupActorInfo';
import { GroupActorManage } from './panels/GroupDetail/GroupActorManage';

subscribeToUserLoginSuccess(() => {
  dispatchAction(getTemplate());
  dispatchAction(getActor());
});

regPersonalPanelItem(
  <SidebarItem
    key="personal-panel-actor"
    icon={
      <Iconfont style={{ color: 'white', fontSize: 24 }}>&#xe61b;</Iconfont>
    }
    name={t('角色')}
    to="/main/personal/actors"
  />
);

regPersonalPanelContent(
  <Route
    key="main-personal-actors"
    path="/main/personal/actors"
    component={TLoadable(() =>
      import('./panels/ActorPanel').then((module) => module.ActorPanel)
    )}
  />
);

regMessageCard('actor', Actor);

regMsgSenderPopover({
  match: (payload: any) => {
    const groupActorUUID = _get(payload, ['data', 'groupActorUUID']);
    const isGroupActorMessage = !_isNil(groupActorUUID);

    return isGroupActorMessage;
  },
  render: (payload: any) => {
    // 显示团角色人物卡信息
    const groupActorUUID = _get(payload, ['data', 'groupActorUUID']);
    return <PopoverGroupActorInfo groupActorUUID={groupActorUUID} />;
  },
});

regGroupInfoMenu({
  type: 'item',
  title: t('人物卡管理'),
  content: <GroupActorManage />,
});
