import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ScrollView } from 'react-native';
import { useSelectedGroupInfo } from '@redux/hooks/group';
import { HTML } from '@app/components/HTML';

export const GroupRuleScreen: React.FC = TMemo((props) => {
  const groupInfo = useSelectedGroupInfo();

  return (
    <ScrollView style={{ flex: 1 }}>
      <HTML html={groupInfo?.rule ?? ''} />
    </ScrollView>
  );
});
GroupRuleScreen.displayName = 'GroupRuleScreen';
