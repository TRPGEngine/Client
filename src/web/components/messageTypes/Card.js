const React = require('react');
const Base = require('./Base');

const CardType = {
  'default': require('./card/BaseCard'),
  'friendInvite': require('./card/FriendInvite'),
  'groupInvite': require('./card/GroupInvite'),
}

class Card extends Base {
  getContent() {
    let info = this.props.info;
    let data = info.data;
    let Card = CardType[data.type] || CardType['default'];
    console.log('TODO: card info', info);
    // TODO: 需要实现各个类型的card方法

    return (
      <Card {...this.props} />
    )
  }
}

module.exports = Card;
