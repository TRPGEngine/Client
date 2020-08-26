import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { WebFastForm } from '../WebFastForm';
import { closeModal } from '../Modal';
import { showToasts } from '@shared/manager/ui';
import { createGroupPanel } from '@shared/model/group';
import { FastFormFieldMeta } from '@shared/components/FastForm';

const fields: FastFormFieldMeta[] = [
  { type: 'text', name: 'name', label: '面板名' },
  {
    type: 'select',
    name: 'type',
    label: '类型',
    options: [
      {
        label: '文字频道',
        value: 'channel',
      },
      // {
      //   label: '富文本',
      //   value: 'richtext',
      // },
    ],
  },
];

interface GroupPanelCreateProps {
  groupUUID: string;
}
export const GroupPanelCreate: React.FC<GroupPanelCreateProps> = TMemo(
  (props) => {
    const { groupUUID } = props;

    const handleCreatePanel = useCallback(
      async (values) => {
        try {
          await createGroupPanel(groupUUID, values.name, values.type);

          closeModal();
          showToasts('面板创建成功');
        } catch (err) {
          showToasts(err);
        }
      },
      [groupUUID]
    );

    return <WebFastForm fields={fields} onSubmit={handleCreatePanel} />;
  }
);
GroupPanelCreate.displayName = 'GroupPanelCreate';
