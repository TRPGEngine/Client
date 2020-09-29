import { t } from '@shared/i18n';
import { showToasts } from '@shared/manager/ui';
import _throttle from 'lodash/throttle';

export const showLimitedToasts = _throttle(
  () => {
    showToasts(t('请求过于频繁'), 'warning');
  },
  1000,
  {
    leading: true,
    trailing: false,
  }
);
