import React from 'react';
import BaseCard from './BaseCard';
import { Text } from 'react-native';

// 默认卡片
class DefaultCard extends BaseCard {
  getCardView() {
    return <Text>[暂不支持显示该消息]</Text>;
  }
}

export default DefaultCard;
