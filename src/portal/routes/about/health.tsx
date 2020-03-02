import React from 'react';
import config from '@shared/project.config';

const Health = React.memo(() => {
  const info = {
    version: config.version,
    environment: config.environment,
    platform: config.platform,
  };

  return <div>{JSON.stringify(info)}</div>;
});

export default Health;
