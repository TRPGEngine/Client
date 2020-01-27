import React from 'react';
import './Spinner.scss';

interface Props {
  visible?: boolean;
  style?: React.CSSProperties;
}

const Spinner: React.FC<Props> = React.memo((props) => {
  const visible = props.visible ?? true;

  return visible ? (
    <div className="single-spinner" style={props.style} />
  ) : null;
});

export default Spinner;
