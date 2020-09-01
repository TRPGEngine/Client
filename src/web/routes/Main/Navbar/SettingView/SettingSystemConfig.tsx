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
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useAlphaUser } from '@shared/hooks/useAlphaUser';

const SelectLanguage: React.FC = TMemo(() => {
  const { language, setLanguage, isChanged } = useLanguage();

  return (
    <div>
      <FullModalField
        title="系统语言"
        value={
          <Select
            style={{ width: 320 }}
            size="large"
            value={language}
            onChange={(val) => setLanguage(val)}
          >
            <Select.Option value="zh-CN">简体中文</Select.Option>
            <Select.Option value="en-US">English</Select.Option>
          </Select>
        }
      />

      {/* TODO: 完全弄好后可以移除 */}
      {isChanged && (
        <Alert
          style={{ marginBottom: 10 }}
          message="语言变更需要重启后完全生效"
          type="error"
        />
      )}

      <div>需要更多的语言支持? 请联系开发者</div>
    </div>
  );
});
SelectLanguage.displayName = 'SelectLanguage';

const AlphaUser: React.FC = TMemo(() => {
  const { isAlphaUser, setIsAlphaUser } = useAlphaUser();

  return (
    <FullModalField
      title="是否为内测用户"
      value={<Switch checked={isAlphaUser} onChange={setIsAlphaUser} />}
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
  const dispatch = useTRPGDispatch();

  const handleRequestNotificationPermission = useCallback(
    (checked: boolean) => {
      dispatch(setSystemSettings({ notification: checked }));
    },
    []
  );

  const handleSetDisableSendWritingState = useCallback((checked: boolean) => {
    dispatch(setSystemSettings({ disableSendWritingState: checked }));
  }, []);

  return (
    <div>
      <Space direction="vertical">
        <SelectLanguage />

        <FullModalField
          title="桌面通知权限"
          value={
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
          title="不发送输入状态"
          value={
            <Switch
              checked={systemSettings.disableSendWritingState}
              onChange={handleSetDisableSendWritingState}
            />
          }
        />

        <AlphaUser />

        <Divider />

        <Button
          size="large"
          type="primary"
          onClick={() => switchToAppVersion(false)}
        >
          切换到旧版UI
        </Button>
      </Space>
    </div>
  );
});
SettingSystemConfig.displayName = 'SettingSystemConfig';
