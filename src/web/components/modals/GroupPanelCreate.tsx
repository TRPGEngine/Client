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
import { t, useTranslation } from '@shared/i18n';
import { checkIsTestUser } from '@web/utils/debug-helper';

const schema = createFastFormSchema({
  name: fieldSchema.string().required(t('面板名不能为空')),
  type: fieldSchema.string().required(t('类型不能为空')),
});

const DEFAULT_TYPE = 'channel';

/**
 * 获取团面板的基础字段
 */
function useGroupPanelBaseFields(): FastFormFieldMeta[] {
  return useMemo(() => {
    const baseFields: FastFormFieldMeta[] = [
      { type: 'text', name: 'name', label: t('面板名') },
      {
        type: 'select',
        name: 'type',
        label: t('类型'),
        options: [
          {
            label: t('文字频道'),
            value: 'channel',
          },
          {
            label: t('笔记面板'),
            value: 'note',
          },
          {
            label: t('语音频道') + '(Beta)',
            value: 'voicechannel',
          },
          {
            label: t('日历面板'),
            value: 'calendar',
          },
        ],
      },
    ];

    return baseFields;
  }, []);
}

/**
 * 动态变更的创建面板fields
 */
function useGroupPanelCreateFields() {
  const [type, setType] = useState(DEFAULT_TYPE);
  const handleChange = useCallback((values) => {
    setType(values.type ?? DEFAULT_TYPE);
  }, []);
  const baseFields = useGroupPanelBaseFields();

  const notes = useTRPGSelector((state) => state.note.list ?? []);
  const fields = useMemo(() => {
    if (type === 'note') {
      return [
        ...baseFields,
        {
          type: 'select',
          name: 'noteUUID',
          label: t('目标笔记'),
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
  }, [type, notes, baseFields]);

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
          showToasts(t('面板创建成功'));
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
