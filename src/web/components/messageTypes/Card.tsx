import React from 'react';
import Base from './Base';

import DefaultCard from './card/DefaultCard';
import BaseCard from './card/BaseCard';
import FriendInvite from './card/FriendInvite';
import GroupRequest from './card/GroupRequest';
import GroupInvite from './card/GroupInvite';
import DiceRequest from './card/DiceRequest';
import DiceInvite from './card/DiceInvite';
import Actor from './card/Actor';

const CardType = {
  default: DefaultCard,
  friendInvite: FriendInvite,
  groupRequest: GroupRequest,
  groupInvite: GroupInvite,
  diceRequest: DiceRequest,
  diceInvite: DiceInvite,
  actor: Actor,

  // alias
  groupRequestSuccess: BaseCard,
  groupRequestFail: BaseCard,
};

class Card extends Base {
  getContent() {
    const info = this.props.info;
    const data = info.data;
    const Card = CardType[data.type] || CardType['default'];

    return <Card {...this.props} />;
  }
}

export default Card;
