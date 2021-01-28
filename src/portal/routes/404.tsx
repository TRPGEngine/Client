import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { t } from '@shared/i18n';

const NotFound: React.FC = TMemo(() => {
  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>{t('页面没找到')}</h2>
    </div>
  );
});
NotFound.displayName = 'NotFound';

export default NotFound;
