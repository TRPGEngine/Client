import { DefaultSettings } from '@shared/project.config';

type NotificationType = 'granted' | 'denied' | 'default';

export type SettingType = string | boolean | number | string[];

interface CustomConfig {
  [name: string]: SettingType;
}

export type ServerConfig = CustomConfig;

export interface SettingsState {
  user: DefaultSettings['user'] & CustomConfig;
  system: DefaultSettings['system'] & CustomConfig;
  notificationPermission: NotificationType;
  config: ServerConfig; // 服务端配置
}
