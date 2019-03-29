const React = require('react');
const BaseCard = require('./BaseCard');

// 默认卡片
class DefaultCard extends BaseCard {
  getCardView() {
    return <pre className="card-content">暂不支持显示该消息</pre>;
  }
}

module.exports = DefaultCard;
