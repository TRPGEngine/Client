import React from 'react';
import Base from '../Base';

import DefaultCard from './DefaultCard';
import BaseCard from './BaseCard';
import FriendInvite from './FriendInvite';
import GroupRequest from './GroupRequest';
import GroupInvite from './GroupInvite';
import DiceRequest from './DiceRequest';
import DiceInvite from './DiceInvite';
import { messageCardList } from '@web/reg/regMessageCard';
import { Media } from './MediaCard';

import './style.less';

const CardType = {
  default: DefaultCard,
  friendInvite: FriendInvite,
  groupRequest: GroupRequest,
  groupInvite: GroupInvite,
  diceRequest: DiceRequest,
  diceInvite: DiceInvite,
  media: Media,

  // alias
  groupRequestSuccess: BaseCard,
  groupRequestFail: BaseCard,

  ...messageCardList,
};

class Card extends Base {
  getContent() {
    const info = this.props.info;
    const data = info.data!;
    const CardComponent = CardType[data.type] || CardType['default'];

    return <CardComponent {...this.props} />;
  }
}

export default Card;
