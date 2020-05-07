import shortid from 'shortid';
import * as stateActions from './stateActions';

interface NotifyActionType {
  type?: string;
  text: string;
  title?: string;
  timeout?: number;
}

// This returns a redux-thunk action (a function).
export const notify = ({
  type = 'info',
  text,
  title,
  timeout,
}: NotifyActionType) => {
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

  return (dispatch) => {
    dispatch(stateActions.addNotification(notification));

    setTimeout(() => {
      dispatch(stateActions.removeNotification(notification.id));
    }, timeout);
  };
};
