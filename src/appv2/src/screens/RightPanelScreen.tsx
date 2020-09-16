import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { View, Text } from 'react-native';

export const RightPanelScreen: React.FC = TMemo(() => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>RightPanelScreen</Text>
    </View>
  );
});
RightPanelScreen.displayName = 'RightPanelScreen';
