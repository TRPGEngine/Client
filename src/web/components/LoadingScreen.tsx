import React from 'react';
import LoadingSpinner from './LoadingSpinner';

import './LoadingScreen.scss';

interface Props {
  show: boolean;
  text: string;
}

const LoadingScreen: React.FC<Props> = React.memo((props) => {
  if (!props.show) {
    return null;
  }

  return (
    <div className="loading-screen">
      <div className="mask">
        <div className="content">
          <LoadingSpinner />
          <span>{props.text}</span>
        </div>
      </div>
    </div>
  );
});
LoadingScreen.displayName = 'LoadingScreen';

export default LoadingScreen;
