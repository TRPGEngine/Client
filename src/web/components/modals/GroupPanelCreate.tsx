import React, { useCallback, useMemo, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { WebFastForm } from '../WebFastForm';
import { closeModal, ModalWrapper } from '../Modal';
import { showToasts } from '@shared/manager/ui';
import { createGroupPanel } from '@shared/model/group';
import { FastFormFieldMeta } from '@shared/components/FastForm/field';
import {
  createFastFormSchema,
  fieldSchema,
} from '@shared/components/FastForm/schema';
import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import _isString from 'lodash/isString';
import { useTranslation } from '@shared/i18n';
import { checkIsTestUser } from '@web/utils/debug-helper';

const schema = createFastFormSchema({
  name: fieldSchema.string().required('面板名不能为空'),
  type: fieldSchema.string().required('类型不能为空'),
});

const DEFAULT_TYPE = 'channel';
const baseFields: FastFormFieldMeta[] = [
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
        label: '笔记面板',
        value: 'note',
      },
    ],
  },
];

if (checkIsTestUser()) {
  baseFields[1].options.push({
    label: '语音频道',
    value: 'voicechannel',
  });
}

/**
 * 动态变更的创建面板fields
 */
function useGroupPanelCreateFields() {
  const [type, setType] = useState(DEFAULT_TYPE);
  const handleChange = useCallback((values) => {
    setType(values.type ?? DEFAULT_TYPE);
  }, []);

  const notes = useTRPGSelector((state) => state.note.list ?? []);
  const fields = useMemo(() => {
    if (type === 'note') {
      return [
        ...baseFields,
        {
          type: 'select',
          name: 'noteUUID',
          label: '目标笔记',
          options: notes
            .filter((note) => _isString(note.uuid))
            .map((note) => ({
              label: note.title,
              value: note.uuid,
            })),
        },
      ];
    }

    return baseFields;
  }, [type, notes]);

  return { fields, handleChange };
}

interface GroupPanelCreateProps {
  groupUUID: string;
}
export const GroupPanelCreate: React.FC<GroupPanelCreateProps> = TMemo(
  (props) => {
    const { groupUUID } = props;
    const { t } = useTranslation();

    const handleCreatePanel = useCallback(
      async (values) => {
        try {
          const { name, type, ...others } = values;
          await createGroupPanel(groupUUID, name, type, others);

          closeModal();
          showToasts('面板创建成功');
        } catch (err) {
          showToasts(err);
        }
      },
      [groupUUID]
    );

    const { fields, handleChange } = useGroupPanelCreateFields();

    return (
      <ModalWrapper title={t('创建面板')}>
        <WebFastForm
          schema={schema}
          fields={fields}
          onSubmit={handleCreatePanel}
          onChange={handleChange}
        />
      </ModalWrapper>
    );
  }
);
GroupPanelCreate.displayName = 'GroupPanelCreate';
