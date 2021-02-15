import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Select, Alert, Button, Space, Divider, Switch } from 'antd';
import { FullModalField } from '@web/components/FullModalField';
import { useLanguage } from '@shared/i18n/language';
import { switchToAppVersion } from '@web/utils/debug-helper';
import {
  useTRPGSelector,
  useTRPGDispatch,
} from '@shared/hooks/useTRPGSelector';
import { setSystemSettings } from '@redux/actions/settings';
import { useAlphaUser } from '@shared/hooks/useAlphaUser';
import { useTranslation } from '@shared/i18n';
import { TipIcon } from '@web/components/TipIcon';

const SelectLanguage: React.FC = TMemo(() => {
  const { language, setLanguage, isChanged } = useLanguage();
  const { t } = useTranslation();

  return (
    <div>
      <FullModalField
        title={t('系统语言')}
        content={
          <Select
            style={{ width: 300 }}
            size="large"
            value={language}
            onChange={(val) => setLanguage(val)}
          >
            <Select.Option value="zh-CN">简体中文</Select.Option>
            <Select.Option value="en-US">English</Select.Option>
          </Select>
        }
      />

      {/* TODO: 动态语言切换完全弄好后可以移除 */}
      {isChanged && (
        <Alert
          style={{ marginBottom: 10 }}
          message={t('语言变更需要重启后完全生效')}
          type="error"
        />
      )}

      <div>{t('需要更多的语言支持? 请联系开发者')}</div>
    </div>
  );
});
SelectLanguage.displayName = 'SelectLanguage';

const AlphaUser: React.FC = TMemo(() => {
  const { isAlphaUser, setIsAlphaUser } = useAlphaUser();
  const { t } = useTranslation();

  return (
    <FullModalField
      title={t('是否为内测用户')}
      content={<Switch checked={isAlphaUser} onChange={setIsAlphaUser} />}
    />
  );
});
AlphaUser.displayName = 'AlphaUser';

/**
 * 系统设置
 */
export const SettingSystemConfig: React.FC = TMemo((props) => {
  const systemSettings = useTRPGSelector((state) => state.settings.system);
  const notificationPermission = useTRPGSelector(
    (state) => state.settings.notificationPermission
  );
  const { isAlphaUser } = useAlphaUser();
  const dispatch = useTRPGDispatch();
  const { t } = useTranslation();

  const handleRequestNotificationPermission = useCallback(
    (checked: boolean) => {
      dispatch(setSystemSettings({ notification: checked }));
    },
    []
  );

  const handleSetDisableSendWritingState = useCallback((checked: boolean) => {
    dispatch(setSystemSettings({ disableSendWritingState: checked }));
  }, []);

  const setSystemSetting = useCallback((key: string, value: any) => {
    dispatch(setSystemSettings({ [key]: value }));
  }, []);

  return (
    <div>
      <Space direction="vertical">
        <SelectLanguage />

        <FullModalField
          title={
            <Space>
              <span>{t('聊天框类型')}</span>
              <TipIcon
                desc={t(
                  '对于旧版浏览器, 可能无法使用一些现代特性。切换到兼容模式以正常使用TRPG Engine进行聊天'
                )}
              />
            </Space>
          }
          content={
            <Select
              style={{ width: 300 }}
              size="large"
              value={systemSettings.chatBoxType}
              onChange={(val) => setSystemSetting('chatBoxType', val)}
            >
              <Select.Option value="auto">{t('自动')}</Select.Option>
              <Select.Option value="compatible">{t('兼容')}</Select.Option>
            </Select>
          }
        />

        <FullModalField
          title={t('桌面通知权限')}
          content={
            <Space>
              <Switch
                checked={systemSettings.notification}
                onChange={handleRequestNotificationPermission}
              />
              <span>{notificationPermission}</span>
            </Space>
          }
        />

        <FullModalField
          title={t('不发送输入状态')}
          content={
            <Switch
              checked={systemSettings.disableSendWritingState}
              onChange={handleSetDisableSendWritingState}
            />
          }
        />

        <FullModalField
          title={t('输入状态显示自己')}
          content={
            <Switch
              checked={systemSettings.showSelfInWritingState}
              onChange={(checked) =>
                setSystemSetting('showSelfInWritingState', checked)
              }
            />
          }
        />

        <AlphaUser />

        {isAlphaUser && (
          <>
            <Divider />

            <Button
              size="large"
              type="primary"
              onClick={() => switchToAppVersion(false)}
            >
              {t('切换到旧版UI')}
            </Button>
          </>
        )}
      </Space>
    </div>
  );
});
SettingSystemConfig.displayName = 'SettingSystemConfig';
