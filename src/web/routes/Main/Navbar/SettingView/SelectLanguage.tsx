import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Select, Alert, Button, Space, Divider } from 'antd';
import { FullModalField } from '@web/components/FullModalField';
import { useLanguage } from '@shared/i18n/language';
import { switchToAppVersion } from '@web/utils/debug-helper';

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

      {isChanged && (
        <Alert
          style={{ marginBottom: 10 }}
          message="语言变更需要重启后生效"
          type="error"
        />
      )}

      <div>需要更多的语言支持? 请联系开发者</div>
    </div>
  );
});
SelectLanguage.displayName = 'SelectLanguage';

/**
 * 系统设置
 */
export const SettingSystemConfig: React.FC = TMemo((props) => {
  return (
    <div>
      <Space direction="vertical">
        <SelectLanguage />

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
