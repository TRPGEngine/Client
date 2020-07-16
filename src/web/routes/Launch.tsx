import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import LoadingSpinner from '@web/components/LoadingSpinner';

export const LaunchRoute: React.FC = TMemo(() => {
  return <LoadingSpinner />;
});
LaunchRoute.displayName = 'LaunchRoute';
