import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import type { FastFormFieldMeta } from '@shared/components/FastForm/field';
import { WebFastForm } from '../WebFastForm';
import { createGroup } from '@shared/model/group';
import { showToasts } from '@shared/manager/ui';
import { closeModal } from '../Modal';
import { useTRPGDispatch } from '@redux/hooks/useTRPGSelector';
import { createGroupSuccess } from '@redux/actions/group';
import {
  createFastFormSchema,
  fieldSchema,
} from '@shared/components/FastForm/schema';

const schema = createFastFormSchema({
  name: fieldSchema.string().required('团名不能为空'),
});

const fields: FastFormFieldMeta[] = [
  { type: 'text', name: 'name', label: '团名', maxLength: 16 },
  {
    type: 'textarea',
    name: 'desc',
    label: '简介',
    maxLength: 100,
    placeholder: '简单介绍一下你的团吧',
  },
];

export const GroupCreate: React.FC = TMemo(() => {
  const dispatch = useTRPGDispatch();
  const handleCreateGroup = useCallback(async (values) => {
    const { name, desc } = values;

    try {
      const group = await createGroup(name, desc);
      dispatch(createGroupSuccess(group));
      showToasts('创建成功');
      closeModal();
    } catch (err) {
      showToasts(err, 'error');
    }
  }, []);

  return (
    <WebFastForm schema={schema} fields={fields} onSubmit={handleCreateGroup} />
  );
});
GroupCreate.displayName = 'GroupCreate';
