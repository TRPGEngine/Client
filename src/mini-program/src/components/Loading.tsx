import { View } from '@tarojs/components';
import React from 'react';
import { AtActivityIndicator } from 'taro-ui';

export const Loading: React.FC = React.memo(() => {
  return (
    <View style={{ height: 160, position: 'relative' }}>
      <AtActivityIndicator mode="center" />
    </View>
  );
});
Loading.displayName = 'Loading';
