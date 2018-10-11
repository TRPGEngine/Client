const React = require('react');
const Base = require('./Base');

const CardType = {
  'default': require('./card/DefaultCard'),
  'friendInvite': require('./card/FriendInvite'),
  'groupInvite': require('./card/GroupInvite'),
  'diceRequest': require('./card/DiceRequest'),
  'diceInvite': require('./card/DiceInvite'),
}

class Card extends Base {
  getContent() {
    let info = this.props.info;
    let data = info.data;
    let Card = CardType[data.type] || CardType['default'];
    console.log('TODO: card info and props', info, this.props); // TODO: 需要实现各个类型的card方法

    return (
      <Card {...this.props} />
    )
  }
}

module.exports = Card;
