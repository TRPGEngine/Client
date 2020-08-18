import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { WebFastForm } from '../WebFastForm';

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
      {
        label: '富文本',
        value: 'richtext',
      },
    ],
  },
];

interface GroupPanelCreateProps {
  groupUUID: string;
}
export const GroupPanelCreate: React.FC<GroupPanelCreateProps> = TMemo(
  (props) => {
    const { groupUUID } = props;

    return (
      <WebFastForm
        fields={fields}
        onSubmit={(values) => {
          console.log('values', values);
        }}
      />
    );
  }
);
GroupPanelCreate.displayName = 'GroupPanelCreate';
