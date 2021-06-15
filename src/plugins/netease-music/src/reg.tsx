import React from 'react';
import { regChatSendBoxAddonAction } from '@capital/web/reg/regChatSendBoxAction';
import { regSettingViewMenu } from '@capital/web/reg/regSettingViewMenu';
import { closeModal, openModal } from '@capital/web/components/Modal';
import { NeteaseMusicSelector } from './components/modals/NeteaseMusicSelector';
import { t } from '@capital/shared/i18n';
import { TLoadable } from '@capital/web/components/TLoadable';

const NeteaseMusicSettingView = TLoadable<any>(() =>
  import('./components/NeteaseMusicSettingView').then(
    (module) => module.NeteaseMusicSettingView
  )
);

regChatSendBoxAddonAction({
  label: t('发送网易云音乐'),
  onClick: ({ converseUUID }) => {
    const key = openModal(
      <NeteaseMusicSelector
        converseUUID={converseUUID}
        onSendMusicCard={() => closeModal(key)}
      />
    );
  },
});

regSettingViewMenu({
  type: 'item',
  title: t('网易云音乐'),
  content: <NeteaseMusicSettingView />,
});
