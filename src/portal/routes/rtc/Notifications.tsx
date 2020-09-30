import React, { useCallback, useState } from 'react';
import {
  useRTCRoomStateDispatch,
  useRTCRoomStateSelector,
} from '@src/rtc/RoomContext';
import { removeNotification } from '@src/rtc/redux/stateActions';
import { TMemo } from '@shared/components/TMemo';
import { useTransition, animated, SpringConfig } from 'react-spring';
import styled from 'styled-components';

const NotificationsContainer = styled.div`
  position: fixed;
  top: 0;
`;

interface Props {
  config?: SpringConfig;
  timeout?: number;
}
export const Notifications: React.FC<Props> = TMemo((props) => {
  const [refMap] = useState(() => new WeakMap());
  const [cancelMap] = useState(() => new WeakMap());
  const notifications = useRTCRoomStateSelector((state) => state.notifications);
  const dispatch = useRTCRoomStateDispatch();
  const handleRemove = useCallback((notificationId: string) => {
    dispatch(removeNotification(notificationId));
  }, []);
  const transitions = useTransition(notifications, (item) => item.id, {
    from: { opacity: 0, height: 0 },
    enter: (item) => ({
      opacity: 1,
      height: refMap.get(item)?.offsetHeight ?? 'auto',
    }),
    leave: (item) => {
      cancelMap.set(item, item);
      return {
        opacity: 0,
        height: 0,
      };
    },
    config: {
      ...props.config,
      duration: props.timeout,
    },
  });

  return (
    <NotificationsContainer>
      {transitions.map(({ key, item, props: { ...style } }) => {
        return (
          <animated.div key={key} style={style}>
            <div
              ref={(ref) => ref && refMap.set(item, ref)}
              onClick={() => handleRemove(item.id)}
            >
              <div className="body">
                {item.title && <p className="title">{item.title}</p>}

                <p className="text">{item.text}</p>
              </div>
            </div>
          </animated.div>
        );
      })}
    </NotificationsContainer>
  );
});
Notifications.displayName = 'Notifications';
Notifications.defaultProps = {
  config: { tension: 125, friction: 20, precision: 0.1 },
  timeout: 3000,
};
