import { View } from '@tarojs/components';
import type { ViewProps } from '@tarojs/components/types/View';
import React from 'react';
import { AtMessage } from 'taro-ui';

interface Props extends ViewProps {}
export const PageView: React.FC<Props> = React.memo((props) => {
  return (
    <View {...props}>
      <AtMessage />

      {props.children}
    </View>
  );
});
PageView.displayName = 'PageView';
