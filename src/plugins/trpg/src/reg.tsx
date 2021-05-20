import React from 'react';
import {
  regPersonalPanelItem,
  regPersonalPanelContent,
} from '@capital/web/reg/regPersonalPanel';
import { SidebarItem } from '@capital/web/routes/Main/Content/SidebarItem';
import { Iconfont } from '@capital/web/components/Iconfont';
import { t } from '@capital/shared/i18n';

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

regPersonalPanelContent();
//
