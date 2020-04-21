import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ScrollView } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { useCurrentGroupInfo } from '@redux/hooks/useCurrentGroupInfo';
import { HTML } from '@app/components/HTML';

export const GroupRuleScreen: NavigationScreenComponent = TMemo((props) => {
  const groupInfo = useCurrentGroupInfo();

  return (
    <ScrollView style={{ flex: 1 }}>
      <HTML html={groupInfo?.rule} />
    </ScrollView>
  );
});
GroupRuleScreen.displayName = 'GroupRuleScreen';
