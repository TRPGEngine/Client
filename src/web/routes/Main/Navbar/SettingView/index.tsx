import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { SidebarViewMenuType, SidebarView } from '@web/components/SidebarView';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { logout } from '@redux/actions/user';
import config from '@shared/project.config';
import { SystemStatusInfo } from '@web/components/modal/SystemStatus';
import { UserSettings } from '@web/components/modal/UserSettings';
import { SettingAccountView } from './SettingAccountView';
import { AccountLoginLog } from './AccountLoginLog';
import { t } from '@shared/i18n';
import { SettingSystemConfig } from './SelectLanguage';
import { ErrorReportView } from '@web/components/ErrorReportView';
import { DevelopLab } from './DevelopLab';

export const SettingView: React.FC = TMemo(() => {
  const dispatch = useTRPGDispatch();
  const menu: SidebarViewMenuType[] = useMemo(
    () => [
      {
        type: 'group',
        title: t('设置'),
        children: [
          {
            type: 'item',
            title: t('我的账号'),
            content: <SettingAccountView />,
          },
          {
            type: 'item',
            title: t('登录记录'),
            content: <AccountLoginLog />,
          },
          {
            type: 'item',
            title: t('个人设置'),
            content: <UserSettings />, // 注意。这里没有办法保存设置. 里面内置的保存是取消挂载时生效。并不好用，需要修改
          },
          {
            type: 'item',
            title: t('系统设置'),
            content: <SettingSystemConfig />, // 注意。这里没有办法保存设置. 里面内置的保存是取消挂载时生效。并不好用，需要修改
          },
        ],
      },
      {
        type: 'group',
        title: t('更多'),
        children: [
          {
            type: 'item',
            title: t('系统状态'),
            content: <SystemStatusInfo style={{ color: 'white' }} />,
          },
          {
            type: 'item',
            title: t('汇报错误'),
            content: <ErrorReportView />,
          },
          {
            type: 'item',
            title: t('开发实验室'),
            content: <DevelopLab />,
          },
        ],
      },
      {
        type: 'group',
        title: '',
        children: [
          {
            type: 'link',
            title: t('清理缓存'),
            onClick: () => {
              window.localStorage.clear();
              window.sessionStorage.clear();
              window.location.href = '/';
            },
          },
          {
            type: 'link',
            title: t('官方网站'),
            onClick: () => window.open(config.url.homepage),
          },
          {
            type: 'link',
            title: t('开发博客'),
            onClick: () => window.open(config.url.blog),
          },
          {
            type: 'link',
            title: t('退出登录'),
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
