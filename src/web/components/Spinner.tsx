import React from 'react';
import classNames from 'classnames';
import './Spinner.scss';

interface Props {
  visible?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const Spinner: React.FC<Props> = React.memo((props) => {
  const visible = props.visible ?? true;

  return visible ? (
    <div
      className={classNames('single-spinner', props.className)}
      style={props.style}
    />
  ) : null;
});
Spinner.displayName = 'Spinner';

export default Spinner;
