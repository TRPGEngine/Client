import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner: React.FC = React.memo(() => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner-inner">
        <div className="rect1" />
        <div className="rect2" />
        <div className="rect3" />
        <div className="rect4" />
        <div className="rect5" />
      </div>
    </div>
  );
});

export default LoadingSpinner;
