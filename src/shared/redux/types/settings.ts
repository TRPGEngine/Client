import { DefaultSettings } from '@shared/project.config';

type NotificationType = 'granted' | 'denied' | 'default';

export type SettingType = string | boolean | number | string[];

interface CustomConfig {
  [name: string]: SettingType;
}

export type ServerConfig = CustomConfig;

export type UserSettings = DefaultSettings['user'] & CustomConfig;
export type SystemSettings = DefaultSettings['system'] & CustomConfig;

export interface SettingsState {
  user: UserSettings;
  system: SystemSettings;
  notificationPermission: NotificationType;
  config: ServerConfig; // 服务端配置
}
