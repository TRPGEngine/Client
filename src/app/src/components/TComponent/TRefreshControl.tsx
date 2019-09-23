import React from 'react';
import { RefreshControl, RefreshControlProps } from 'react-native';

const TRefreshControl = (props: RefreshControlProps) => (
  <RefreshControl
    colors={['#5dd3d2', '#ffaa4d', '#2f9bd7', '#f88756']}
    progressBackgroundColor="#ffffff"
    title="加载中..."
    {...props}
  />
);

export default TRefreshControl;
