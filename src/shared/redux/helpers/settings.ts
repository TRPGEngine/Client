import { getStoreState } from '@redux/configureStore/helper';
import type { SettingType } from '@redux/types/settings';
import _get from 'lodash/get';

/**
 * 获取用户设置
 */
export function getUserSettings<T extends SettingType>(
  field: string,
  defaultValue: T
): T {
  const state = getStoreState();

  return (_get(state, ['settings', 'user', field]) as T) ?? defaultValue;
}

/**
 * 获取系统设置
 */
export function getSystemSettings<T extends SettingType>(
  field: string,
  defaultValue: T
): T {
  const state = getStoreState();

  return (_get(state, ['settings', 'system', field]) as T) ?? defaultValue;
}
