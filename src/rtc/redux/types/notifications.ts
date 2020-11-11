interface NotificationType {
  id: string;
  type: 'info' | 'error';
  text: string;
}

export type NotificationsStateType = NotificationType[];
