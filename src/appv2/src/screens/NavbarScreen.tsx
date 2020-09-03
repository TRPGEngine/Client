import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { View, Text } from 'react-native';

export const NavbarScreen: React.FC = TMemo(() => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Navbar Screen</Text>
    </View>
  );
});
NavbarScreen.displayName = 'NavbarScreen';
