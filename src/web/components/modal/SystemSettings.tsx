import React, { useCallback } from 'react';
import ModalPanel from '../ModalPanel';
import Checkbox from '../Checkbox';
import { setSystemSettings } from '@shared/redux/actions/settings';
import { TMemo } from '@shared/components/TMemo';
import {
  useTRPGSelector,
  useTRPGDispatch,
} from '@shared/hooks/useTRPGSelector';
import styled from 'styled-components';
import { useAlphaUser } from '@shared/hooks/useAlphaUser';

const SettingCell = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 12px;

  > label {
    flex: 1;
    text-align: left;
  }
`;

/**
 * 系统设置模态框
 */
const SystemSettings: React.FC = TMemo(() => {
  const notificationPermission = useTRPGSelector(
    (state) => state.settings.notificationPermission
  );
  const systemSettings = useTRPGSelector((state) => state.settings.system);
  const dispatch = useTRPGDispatch();
  const { isAlphaUser, setIsAlphaUser } = useAlphaUser();

  const handleRequestNotificationPermission = useCallback(
    (isChecked: boolean) => {
      dispatch(setSystemSettings({ notification: isChecked }));
    },
    [dispatch]
  );

  return (
    <ModalPanel title="系统设置">
      <SettingCell>
        <label>桌面通知权限({notificationPermission})</label>
        <Checkbox
          value={systemSettings.notification}
          onChange={handleRequestNotificationPermission}
        />
      </SettingCell>
      <SettingCell>
        <label>是否为内测用户</label>
        <Checkbox value={isAlphaUser} onChange={setIsAlphaUser} />
      </SettingCell>
    </ModalPanel>
  );
});
SystemSettings.displayName = 'SystemSettings';

export default SystemSettings;
