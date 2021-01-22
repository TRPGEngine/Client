import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Button, Space } from 'antd';
import { t } from '@shared/i18n';
import config from '@shared/project.config';

/**
 * sw更新提示的按钮
 */
export const UpdateNotificationBtn: React.FC = TMemo(() => {
  return (
    <Space>
      <Button
        type="link"
        size="small"
        onClick={() => window.open(config.url.versionBlog)}
      >
        {t('更新日志')}
      </Button>
      <Button
        type="primary"
        size="small"
        onClick={() => window.location.reload()}
      >
        {t('立即刷新')}
      </Button>
    </Space>
  );
});
UpdateNotificationBtn.displayName = 'UpdateNotificationBtn';
