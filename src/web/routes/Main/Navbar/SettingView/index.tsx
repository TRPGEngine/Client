import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { SidebarViewMenuType, SidebarView } from '@web/components/SidebarView';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { logout } from '@redux/actions/user';
import config from '@shared/project.config';
import { SystemStatusInfo } from '@web/components/modal/SystemStatus';
import { UserSettings } from '@web/components/modal/UserSettings';
import { SettingAccountView } from './SettingAccountView';

export const SettingView: React.FC = TMemo(() => {
  const dispatch = useTRPGDispatch();
  const menu: SidebarViewMenuType[] = useMemo(
    () => [
      {
        type: 'group',
        title: '设置',
        children: [
          {
            type: 'item',
            title: '我的账号',
            content: <SettingAccountView />,
          },
          {
            type: 'item',
            title: '个人设置',
            content: <UserSettings />, // 注意。这里没有办法保存设置. 里面内置的保存是取消挂载时生效。并不好用，需要修改
          },
        ],
      },
      {
        type: 'group',
        title: '更多',
        children: [
          {
            type: 'item',
            title: '系统状态',
            content: <SystemStatusInfo />,
          },
        ],
      },
      {
        type: 'group',
        title: '',
        children: [
          {
            type: 'link',
            title: '清理缓存',
            onClick: () => {
              window.localStorage.clear();
              window.sessionStorage.clear();
              window.location.reload();
            },
          },
          {
            type: 'link',
            title: '官方网站',
            onClick: () => window.open(config.url.homepage),
          },
          {
            type: 'link',
            title: '开发博客',
            onClick: () => window.open(config.url.blog),
          },
          {
            type: 'link',
            title: '退出登录',
            onClick: () => dispatch(logout()),
            isDanger: true,
          },
        ],
      },
    ],
    []
  );

  return <SidebarView defaultContentPath="0.children.0.content" menu={menu} />;
});
SettingView.displayName = 'SettingView';
