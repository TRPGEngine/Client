const React = require('react');
const BaseCard = require('./BaseCard');
const { Text } = require('react-native');

// 默认卡片
class DefaultCard extends BaseCard {
  getCardView() {
    return <Text>暂不支持显示该消息</Text>;
  }
}

module.exports = DefaultCard;
