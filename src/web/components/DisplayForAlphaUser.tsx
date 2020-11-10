import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useTranslation } from '@shared/i18n';
import { Result } from 'antd';

export const DisplayForAlphaUser: React.FC = TMemo(() => {
  const { t } = useTranslation();

  return <Result status="403" title={t('该功能仅对内测用户开放')} />;
});
DisplayForAlphaUser.displayName = 'DisplayForAlphaUser';
