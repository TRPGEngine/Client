import React, { useCallback, useState } from 'react';
import {
  useRoomStateDispatch,
  useRoomStateSelector,
} from '@src/rtc/RoomContext';
import { removeNotification } from '@src/rtc/redux/stateActions';
import { TMemo } from '@shared/components/TMemo';
import { useTransition, animated, SpringConfig } from 'react-spring';

interface Props {
  config?: SpringConfig;
  timeout?: number;
}
export const Notifications: React.FC<Props> = TMemo((props) => {
  const [refMap] = useState(() => new WeakMap());
  const [cancelMap] = useState(() => new WeakMap());
  const notifications = useRoomStateSelector((state) => state.notifications);
  const dispatch = useRoomStateDispatch();
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
    <div>
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
    </div>
  );
});
Notifications.displayName = 'Notifications';
Notifications.defaultProps = {
  config: { tension: 125, friction: 20, precision: 0.1 },
  timeout: 3000,
};
