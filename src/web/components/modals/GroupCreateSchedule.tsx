import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { WebFastForm } from '../WebFastForm';
import { FastFormFieldMeta } from '@shared/components/FastForm/field';
import { ModalWrapper } from '../Modal';
import { t } from '@shared/i18n';

const fields: FastFormFieldMeta[] = [
  {
    type: 'textarea',
    name: 'note',
    label: t('事件'),
    maxLength: 100,
    placeholder: '',
  },
];

interface FieldValues {
  note: string;
}

/**
 * 团日历面板创建日程
 */
export const GroupCreateSchedule: React.FC<{
  date: string; // YYYY-MM-DD
  onCreateSchedule: (values: FieldValues) => void;
}> = TMemo((props) => {
  const { date, onCreateSchedule } = props;

  return (
    <ModalWrapper title={t('创建日程') + ': ' + date}>
      <WebFastForm fields={fields} onSubmit={onCreateSchedule} />
    </ModalWrapper>
  );
});
GroupCreateSchedule.displayName = 'GroupCreateSchedule';
