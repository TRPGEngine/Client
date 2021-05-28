import React from 'react';
import {
  regPersonalPanelItem,
  regPersonalPanelContent,
} from '@capital/web/reg/regPersonalPanel';
import { SidebarItem } from '@capital/web/routes/Main/Content/SidebarItem';
import { Iconfont } from '@capital/web/components/Iconfont';
import { t } from '@capital/shared/i18n';
import { Route } from 'react-router';
import { TLoadable } from '@capital/web/components/TLoadable';
import { subscribeToUserLoginSuccess } from '@capital/shared/manager/userState';
import { dispatchAction } from '@capital/shared/redux/configureStore/helper';
import { getTemplate, getActor } from './redux/actions/actor';

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
    path="/main/personal/actors"
    component={TLoadable(() =>
      import('./panels/ActorPanel').then((module) => module.ActorPanel)
    )}
  />
);
