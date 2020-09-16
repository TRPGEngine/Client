import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { WebFastForm } from '../WebFastForm';
import { closeModal } from '../Modal';
import { showToasts } from '@shared/manager/ui';
import { FastFormFieldMeta } from '@shared/components/FastForm/field';
import { updateGroupPanelInfo } from '@shared/model/group';
import { useGroupPanelInfo } from '@redux/hooks/group';

interface GroupPanelUpdateInfoProps {
  groupUUID: string;
  panelUUID: string;
}
export const GroupPanelUpdateInfo: React.FC<GroupPanelUpdateInfoProps> = TMemo(
  (props) => {
    const { groupUUID, panelUUID } = props;
    const panelInfo = useGroupPanelInfo(groupUUID, panelUUID);

    const fields: FastFormFieldMeta[] = [
      {
        type: 'text',
        name: 'name',
        label: '面板名',
        defaultValue: panelInfo?.name ?? '',
      },
    ];

    const handleCreatePanel = useCallback(
      async (values) => {
        try {
          await updateGroupPanelInfo(groupUUID, panelUUID, values);

          closeModal();
          showToasts('更新成功');
        } catch (err) {
          showToasts(err);
        }
      },
      [groupUUID, panelUUID]
    );

    return <WebFastForm fields={fields} onSubmit={handleCreatePanel} />;
  }
);
GroupPanelUpdateInfo.displayName = 'GroupPanelUpdateInfo';
