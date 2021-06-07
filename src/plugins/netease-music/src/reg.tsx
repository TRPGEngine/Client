import React from 'react';
import { regChatSendBoxAddonAction } from '@capital/web/reg/regChatSendBoxAction';
import { openModal } from '@capital/web/components/Modal';
import { NeteaseMusicSelector } from './components/modals/NeteaseMusicSelector';
import { t } from '@capital/shared/i18n';

regChatSendBoxAddonAction({
  label: t('发送网易云音乐'),
  onClick: () => {
    openModal(<NeteaseMusicSelector />);
  },
});
