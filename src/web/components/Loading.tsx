import React from 'react';
import LoadingSpinner from './LoadingSpinner';

import './Loading.scss';

interface Props {
  show: boolean;
  text: string;
}

const Loading: React.FC<Props> = React.memo((props) => {
  if (!props.show) {
    return null;
  }

  return (
    <div className="loading">
      <div className="mask">
        <div className="content">
          <LoadingSpinner />
          <span>{props.text}</span>
        </div>
      </div>
    </div>
  );
});

export default Loading;
