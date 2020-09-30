import { createReducer } from '@reduxjs/toolkit';
import {
  addNotification,
  removeNotification,
  removeAllNotifications,
} from '../stateActions';
import { NotificationsStateType } from '../types/notifications';

const initialState: NotificationsStateType = [];

export default createReducer<NotificationsStateType>(
  initialState,
  (builder) => {
    builder
      .addCase(addNotification, (state, action) => {
        const { notification } = action.payload;

        state.push(notification);
      })
      .addCase(removeNotification, (state, action) => {
        const { notificationId } = action.payload;

        const idx = state.findIndex(
          (notification) => notification.id === notificationId
        );
        if (idx >= 0) {
          state.splice(idx, 1);
        }
      })
      .addCase(removeAllNotifications, (state, action) => {
        state = [];
      });
  }
);
