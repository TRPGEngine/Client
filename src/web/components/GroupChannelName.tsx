import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useGroupChannel } from '@redux/hooks/group';
import _find from 'lodash/find';
import _isNil from 'lodash/isNil';
import { useTranslation } from '@shared/i18n';

interface GroupChannelNameProps {
  groupUUID: string;
  channelUUID: string | null | undefined;
}
export const GroupChannelName: React.FC<GroupChannelNameProps> = TMemo(
  (props) => {
    const { groupUUID, channelUUID } = props;
    const channels = useGroupChannel(groupUUID);
    const { t } = useTranslation();

    if (_isNil(channelUUID)) {
      return <span>{t('大厅')}</span>;
    }

    const name = _find(channels, ['uuid', channelUUID])?.name ?? '';

    return <span>{name}</span>;
  }
);
GroupChannelName.displayName = 'GroupChannelName';
