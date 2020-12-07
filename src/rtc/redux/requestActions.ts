import { createAsyncThunk } from '@reduxjs/toolkit';
import shortid from 'shortid';
import * as stateActions from './stateActions';

interface NotifyActionType {
  type?: string;
  text: string;
  title?: string;
  timeout?: number;
}

export const notify = createAsyncThunk(
  'NOTIFY',
  ({ type = 'info', text, title, timeout }: NotifyActionType, { dispatch }) => {
    if (!timeout) {
      switch (type) {
        case 'info':
          timeout = 3000;
          break;
        case 'error':
          timeout = 5000;
          break;
      }
    }

    const notification = {
      id: shortid.generate().toLowerCase(),
      type,
      title,
      text,
      timeout,
    };

    dispatch(stateActions.addNotification(notification));

    setTimeout(() => {
      dispatch(stateActions.removeNotification(notification.id));
    }, timeout);
  }
);
