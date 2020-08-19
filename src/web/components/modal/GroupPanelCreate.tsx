import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { WebFastForm } from '../WebFastForm';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { createGroupPanel } from '@redux/actions/group';
import { closeModal } from '../Modal';

const fields = [
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
    const dispatch = useTRPGDispatch();

    const handleCreatePanel = useCallback(
      (values) => {
        dispatch(
          createGroupPanel(groupUUID, values.name, values.type, () => {
            closeModal();
          })
        );
      },
      [groupUUID]
    );

    return <WebFastForm fields={fields} onSubmit={handleCreatePanel} />;
  }
);
GroupPanelCreate.displayName = 'GroupPanelCreate';
