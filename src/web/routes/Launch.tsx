import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { TMemo } from '@shared/components/TMemo';
import LoadingSpinner from '@web/components/LoadingSpinner';

export const LaunchRoute: React.FC = TMemo(() => {
  const history = useHistory();

  useEffect(() => {
    // 先临时写一下，直接跳转到login
    history.push('/login');
  }, []);

  return <LoadingSpinner />;
});
LaunchRoute.displayName = 'LaunchRoute';
