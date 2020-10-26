import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Select } from 'antd';
import {
  useTRPGDispatch,
  useTRPGSelector,
} from '@shared/hooks/useTRPGSelector';
import { FullModalField } from '@web/components/FullModalField';
import { useTranslation } from '@shared/i18n';
import { setUserSettings } from '@redux/actions/settings';

/**
 * 个人设置
 */
export const SettingUserConfig: React.FC = TMemo(() => {
  const userSettings = useTRPGSelector((state) => state.settings.user);
  const { t } = useTranslation();
  const dispatch = useTRPGDispatch();

  const handleSetMsgType = useCallback((value: 'bubble' | 'compact') => {
    dispatch(setUserSettings({ msgType: value }));
  }, []);

  return (
    <div>
      <FullModalField
        title="对话消息"
        content={
          <Select value={userSettings.msgType} onChange={handleSetMsgType}>
            <Select.Option value="bubble">{t('气泡模式')}</Select.Option>
            <Select.Option value="compact">{t('紧凑模式')}</Select.Option>
          </Select>
        }
      />
    </div>
  );
});
SettingUserConfig.displayName = 'SettingUserConfig';
