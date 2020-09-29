import React, { useCallback, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { WebFastForm } from '../WebFastForm';
import { closeModal, ModalWrapper } from '../Modal';
import { showToasts } from '@shared/manager/ui';
import {
  FastFormFieldMeta,
  FastFormFieldProps,
} from '@shared/components/FastForm/field';
import { updateGroupPanelInfo } from '@shared/model/group';
import { useGroupPanelInfo, useGroupMemberUUIDs } from '@redux/hooks/group';
import { GroupPanel, GroupPanelVisible } from '@shared/types/panel';
import { useTranslation } from '@shared/i18n';
import { UserUUIDSelector } from '../UserUUIDSelector';

function useGroupPanelUpdateInfoFields(
  groupUUID: string,
  panelInfo?: GroupPanel
) {
  const defaultVisibleType = panelInfo?.visible ?? 'all';
  const [visibleType, setVisibleType] = useState<GroupPanelVisible>(
    defaultVisibleType
  );
  const handleChange = useCallback((values) => {
    setVisibleType(values.visible ?? 'all');
  }, []);
  const groupMembers = useGroupMemberUUIDs(groupUUID);
  const { t } = useTranslation();

  const fields: FastFormFieldMeta[] = [
    {
      type: 'text',
      name: 'name',
      label: t('面板名'),
      defaultValue: panelInfo?.name ?? '',
    },
    {
      type: 'select',
      name: 'visible',
      label: t('可见性'),
      defaultValue: defaultVisibleType,
      options: [
        {
          label: t('所有人可见'),
          value: 'all',
        },
        {
          label: t('管理员可见'),
          value: 'manager',
        },
        {
          label: t('指定用户可见'),
          value: 'assign',
        },
      ],
    },
  ];

  if (visibleType === 'assign') {
    // 增加成员
    fields.push({
      type: 'custom',
      name: 'members',
      label: t('指定成员'),
      defaultValue: panelInfo?.members ?? [],
      render(props: FastFormFieldProps) {
        return (
          <UserUUIDSelector
            allUserUUIDs={groupMembers}
            value={props.value}
            onChange={props.onChange}
          />
        );
      },
    });
  }

  return { fields, handleChange };
}

interface GroupPanelUpdateInfoProps {
  groupUUID: string;
  panelUUID: string;
}
export const GroupPanelUpdateInfo: React.FC<GroupPanelUpdateInfoProps> = TMemo(
  (props) => {
    const { groupUUID, panelUUID } = props;
    const panelInfo = useGroupPanelInfo(groupUUID, panelUUID);
    const { t } = useTranslation();

    const { fields, handleChange } = useGroupPanelUpdateInfoFields(
      groupUUID,
      panelInfo
    );

    const handleCreatePanel = useCallback(
      async (values) => {
        try {
          await updateGroupPanelInfo(groupUUID, panelUUID, values);

          showToasts(t('更新成功'));
          setTimeout(() => {
            // 给一个延时来确保FastForm的表单loading结束
            closeModal();
          }, 0);
        } catch (err) {
          showToasts(err);
        }
      },
      [groupUUID, panelUUID]
    );

    return (
      <ModalWrapper>
        <WebFastForm
          fields={fields}
          onSubmit={handleCreatePanel}
          onChange={handleChange}
        />
      </ModalWrapper>
    );
  }
);
GroupPanelUpdateInfo.displayName = 'GroupPanelUpdateInfo';
