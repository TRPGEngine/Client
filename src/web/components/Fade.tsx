import React from 'react';
import { animated, useSpring } from 'react-spring';
import _isFunction from 'lodash/isFunction';

interface FadeProps {
  in: boolean;
  onEnter: () => void;
  onExited: () => void;
}
export const Fade = React.forwardRef<HTMLDivElement, FadeProps>(
  (props, ref) => {
    const { in: open, children, onEnter, onExited } = props;
    const style = useSpring({
      from: { opacity: 0 },
      to: { opacity: open ? 1 : 0 },
      onStart: () => {
        if (open && _isFunction(onEnter)) {
          onEnter();
        }
      },
      onRest: () => {
        if (!open && _isFunction(onExited)) {
          onExited();
        }
      },
    });

    return (
      <animated.div ref={ref} style={style}>
        {children}
      </animated.div>
    );
  }
);
Fade.displayName = 'Fade';
