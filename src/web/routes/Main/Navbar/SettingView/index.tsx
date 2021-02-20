import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { SidebarViewMenuType, SidebarView } from '@web/components/SidebarView';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { logout } from '@redux/actions/user';
import config from '@shared/project.config';
import { SystemStatusInfo } from '@web/components/modals/SystemStatus';
import { SettingAccountView } from './SettingAccountView';
import { AccountLoginLog } from './AccountLoginLog';
import { SettingSystemConfig } from './SettingSystemConfig';
import { ErrorReportView } from '@web/components/ErrorReportView';
import { DevelopLab } from './DevelopLab';
import { AboutView } from './AboutView';
import { useTranslation } from '@shared/i18n';
import { showAlert } from '@shared/manager/ui';
import { SettingUserConfig } from './SettingUserConfig';
import { SettingAudioConfig } from './SettingAudioConfig';
import { useCurrentUserInfo } from '@redux/hooks/user';
import { openPostWindow } from '@web/utils/dom-helper';
import { getUserName } from '@shared/utils/data-helper';
import { trackEvent } from '@web/utils/analytics-helper';

export const SettingView: React.FC = TMemo(() => {
  const userInfo = useCurrentUserInfo();
  const dispatch = useTRPGDispatch();
  const { t } = useTranslation();

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
            content: <SettingUserConfig />,
          },
          {
            type: 'item',
            title: t('系统设置'),
            content: <SettingSystemConfig />,
          },
          {
            type: 'item',
            title: t('语音设置'),
            content: <SettingAudioConfig />,
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
            title: t('汇报错误'), // TODO: 这个功能不应当依赖于sentry报错
            isDev: true,
            content: <ErrorReportView />,
          },
          {
            type: 'item',
            isDev: true,
            title: t('开发实验室'),
            content: <DevelopLab />,
          },
          {
            type: 'item',
            title: t('关于'),
            content: <AboutView />,
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
              showAlert({
                message: t('确认要清除缓存么'),
                onConfirm() {
                  window.localStorage.clear();
                  window.sessionStorage.clear();
                  window.location.href = '/';
                },
              });
            },
          },
          {
            type: 'link',
            title: t('意见反馈'),
            onClick: () => {
              trackEvent('web:txc');
              openPostWindow({
                url: config.url.txcUrl,
                data: {
                  openid: userInfo.uuid,
                  nickname: getUserName(userInfo),
                  avatar: userInfo.avatar,
                },
              });
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
    [t]
  );

  return <SidebarView defaultContentPath="0.children.0.content" menu={menu} />;
});
SettingView.displayName = 'SettingView';
