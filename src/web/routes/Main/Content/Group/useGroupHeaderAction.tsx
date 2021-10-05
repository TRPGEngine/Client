import React from 'react';
import type { GroupInfo } from '@redux/types/group';
import { PortalAdd, PortalRemove } from '@web/utils/portal';
import { useCallback } from 'react';
import { FullModal } from '@web/components/FullModal';
import { GroupInfoDetail } from './GroupInfoDetail';
import { showAlert, showToasts } from '@shared/manager/ui';
import _isNil from 'lodash/isNil';
import _isString from 'lodash/isString';
import { useTRPGDispatch } from '@redux/hooks/useTRPGSelector';
import { useCurrentUserUUID } from '@redux/hooks/user';
import { dismissGroup, quitGroup } from '@redux/actions/group';
import { GroupPanelCreate } from '@web/components/modals/GroupPanelCreate';
import { openModal } from '@web/components/Modal';
import { useTranslation } from '@shared/i18n';
import { GroupInvite } from '@web/components/modals/GroupInvite';

export function useGroupHeaderAction(groupInfo: GroupInfo) {
  const { t } = useTranslation();
  const dispatch = useTRPGDispatch();
  const currentUserUUID = useCurrentUserUUID();
  const groupUUID = groupInfo.uuid;

  const handleShowGroupInfo = useCallback(() => {
    const key = PortalAdd(
      <FullModal visible={true} onChangeVisible={() => PortalRemove(key)}>
        <GroupInfoDetail groupUUID={groupUUID} />
      </FullModal>
    );
  }, [groupUUID]);

  const handleShowInvite = useCallback(() => {
    openModal(<GroupInvite groupUUID={groupUUID} />);
  }, [groupUUID]);

  // 创建面板
  const handleCreateGroupPanel = useCallback(() => {
    openModal(<GroupPanelCreate groupUUID={groupUUID} />);
  }, [groupUUID]);

  // 解散/退出团
  const handleQuitGroup = useCallback(() => {
    if (_isNil(groupInfo)) {
      showToasts(t('找不到该团'));
      return;
    }

    const groupUUID = groupInfo.uuid;
    if (currentUserUUID === groupInfo.owner_uuid) {
      // 解散团(群组所有者)
      showAlert({
        title: t('是否要解散群'),
        message: t('一旦确定无法撤销'),
        onConfirm: () => {
          dispatch(dismissGroup(groupUUID));
        },
      });
    } else {
      // 退出群(普通用户)
      showAlert({
        title: t('是否要退出群'),
        message: t('一旦确定无法撤销'),
        onConfirm: () => {
          dispatch(quitGroup(groupUUID));
        },
      });
    }
  }, [currentUserUUID, groupInfo?.owner_uuid, groupInfo?.uuid, t]);

  return {
    handleShowGroupInfo,
    handleShowInvite,
    handleCreateGroupPanel,
    handleQuitGroup,
  };
}
