const React = require('react');
const Base = require('./Base');

const CardType = {
  'default': require('./card/DefaultCard'),
  'friendInvite': require('./card/FriendInvite'),
  // 'groupRequest': require('./card/GroupRequest'),
  // 'groupInvite': require('./card/GroupInvite'),
  // 'diceRequest': require('./card/DiceRequest'),
  // 'diceInvite': require('./card/DiceInvite'),
  // 'actor': require('./card/Actor'),
}

class Card extends Base {
  getContent() {
    let info = this.props.info;
    let data = info.data;
    let Card = CardType[data.type] || CardType['default'];

    return (
      <Card {...this.props} />
    )
  }
}

module.exports = Card;
