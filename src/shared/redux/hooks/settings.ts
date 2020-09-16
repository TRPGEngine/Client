import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import { SettingsState } from '@redux/types/settings';
import { DefaultSettings } from '@shared/project.config';

/**
 * 获取用户设置项
 */
export function useUserSetting(key: string) {
  return useTRPGSelector((state) => {
    return state.settings.user[key];
  });
}

/**
 * 获取系统设置项
 */
export function useSystemSetting(key: keyof DefaultSettings['system']) {
  return useTRPGSelector((state) => {
    return state.settings.system[key];
  });
}
