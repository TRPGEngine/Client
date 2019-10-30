import { Record } from 'immutable';

type NotificationType = 'granted' | 'denied' | 'default';

export type SettingsState = Record<{
  user: any;
  system: any;
  notificationPermission: NotificationType;
}>;
