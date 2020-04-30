import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ScrollView } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { useSelectedGroupInfo } from '@redux/hooks/useGroup';
import { HTML } from '@app/components/HTML';

export const GroupRuleScreen: NavigationScreenComponent = TMemo((props) => {
  const groupInfo = useSelectedGroupInfo();

  return (
    <ScrollView style={{ flex: 1 }}>
      <HTML html={groupInfo?.rule} />
    </ScrollView>
  );
});
GroupRuleScreen.displayName = 'GroupRuleScreen';
