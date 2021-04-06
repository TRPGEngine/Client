import { TMemo } from '@shared/components/TMemo';
import { t } from '@shared/i18n';
import { Alert } from 'antd';
import React from 'react';

export const DeprecatedComponent: React.FC = TMemo(() => {
  return (
    <Alert
      type="error"
      message={t('该组件已被弃用, 如果影响到您的使用请联系开发者')}
    />
  );
});
DeprecatedComponent.displayName = 'DeprecatedComponent';
