import {
  CommonGroupPanelData,
  getCommonGroupPanelData,
} from '@shared/model/group';
import { useAsync } from 'react-use';
import _isString from 'lodash/isString';

/**
 * 获取通用团面板数据的hooks
 * @param groupUUID 团UUID
 * @param panelUUID 面板UUID
 */
export function useCommonGroupPanelData<T extends CommonGroupPanelData>(
  groupUUID?: string,
  panelUUID?: string
): {
  panelData: Partial<T>;
  panelDataLoading: boolean;
  panelDataError?: Error;
} {
  const { value = {}, loading, error } = useAsync(async () => {
    if (!_isString(groupUUID) || !_isString(panelUUID)) {
      return {};
    }

    const panelData = await getCommonGroupPanelData(groupUUID, panelUUID);

    return (panelData ?? {}) as Partial<T>;
  }, [groupUUID, panelUUID]);

  return {
    panelData: value,
    panelDataLoading: loading,
    panelDataError: error,
  };
}
