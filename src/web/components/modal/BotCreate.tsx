import React, { useCallback, useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { WebFastForm } from '../WebFastForm';
import { FastFormFieldMeta } from '@shared/components/FastForm/field';
import { useTranslation } from '@shared/i18n';
import { ModalWrapper, useModalContext } from '../Modal';
import { createMsgTokenBot } from '@shared/model/bot';
import { useGroupChannel } from '@redux/hooks/group';
import { showAlert, showToasts } from '@shared/manager/ui';
import { BotResultTip } from '../BotResultTip';
import _isFunction from 'lodash/isFunction';

const baseFields: FastFormFieldMeta[] = [
  { type: 'text', name: 'name', label: '机器人名', maxLength: 16 },
];

interface BotCreateProps {
  groupUUID: string;
  onSuccess?: () => void;
}

/**
 * 创建机器人
 */
export const BotCreate: React.FC<BotCreateProps> = TMemo((props) => {
  const { groupUUID, onSuccess } = props;
  const { t } = useTranslation();
  const channels = useGroupChannel(groupUUID);
  const { closeModal } = useModalContext();

  const fields = useMemo(() => {
    return [
      ...baseFields,
      {
        type: 'select',
        name: 'channelUUID',
        label: '频道',
        options: [
          {
            label: '大厅',
            value: null,
          },
          ...channels.map((channel) => ({
            label: channel.name,
            value: channel.uuid,
          })),
        ],
      },
    ];
  }, [channels]);

  const handleCreateBot = useCallback(
    async (values) => {
      try {
        const bot = await createMsgTokenBot(
          values.name,
          groupUUID,
          values.channelUUID
        );

        _isFunction(onSuccess) && onSuccess();
        closeModal();
        showAlert({
          message: <BotResultTip name={bot.name} token={bot.token} />,
        });
      } catch (err) {
        showToasts(err, 'error');
      }
    },
    [groupUUID, onSuccess, closeModal]
  );

  return (
    <ModalWrapper title={t('创建机器人')}>
      <WebFastForm fields={fields} onSubmit={handleCreateBot} />
    </ModalWrapper>
  );
});
BotCreate.displayName = 'BotCreate';
