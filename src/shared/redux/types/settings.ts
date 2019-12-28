type NotificationType = 'granted' | 'denied' | 'default';

export interface ServerConfig {
  [name: string]: string | boolean | number | string[];
}

export interface SettingsState {
  user: any;
  system: any;
  notificationPermission: NotificationType;
  config: ServerConfig; // 服务端配置
}
