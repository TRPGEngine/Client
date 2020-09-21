import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Button, Typography } from 'antd';
import { useTranslation } from '@shared/i18n';
import { ModalWrapper, openModal } from '@web/components/Modal';
import { BotCreate } from '@web/components/modal/BotCreate';

interface GroupBotManageProps {
  groupUUID: string;
}
export const GroupBotManage: React.FC<GroupBotManageProps> = TMemo(
  (props: GroupBotManageProps) => {
    const { groupUUID } = props;
    const { t } = useTranslation();

    const handleCreateBot = useCallback(() => {
      openModal(<BotCreate groupUUID={groupUUID} />);
    }, [groupUUID]);

    return (
      <div>
        <Typography.Title level={3}>{t('机器人')}</Typography.Title>

        <Button type="primary" onClick={handleCreateBot}>
          {t('创建机器人')}
        </Button>

        {/* TODO */}
        {/* <div>机器人列表</div> */}
      </div>
    );
  }
);
GroupBotManage.displayName = 'GroupBotManage';
