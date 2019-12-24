type NotificationType = 'granted' | 'denied' | 'default';

export interface SettingsState {
  user: any;
  system: any;
  notificationPermission: NotificationType;
}
