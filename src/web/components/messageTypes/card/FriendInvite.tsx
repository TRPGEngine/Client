import BaseCard from './BaseCard';
import { connect, DispatchProp } from 'react-redux';
import {
  agreeFriendInvite,
  refuseFriendInvite,
} from '@shared/redux/actions/user';
import type { MessageProps } from '@shared/components/message/MessageHandler';
import type { TRPGState } from '@src/shared/redux/types/__all__';
import _get from 'lodash/get';
import { getFriendInviteInfoCache } from '@shared/utils/cache-helper';

interface Props extends MessageProps, DispatchProp<any> {
  friendList: any;
}

// 好友邀请
class FriendInvite extends BaseCard<Props> {
  getCardBtn() {
    const info = this.props.info;
    const data = info.data;
    const inviteUUID = _get(data, 'invite.uuid');
    const inviteInfo = getFriendInviteInfoCache(inviteUUID);
    const is_agree = inviteInfo.is_agree ?? false;
    const is_refuse = inviteInfo.is_refuse ?? false;

    const processed = is_agree || is_refuse;

    if (!processed) {
      // 尚未处理
      return [
        {
          label: '拒绝',
          onClick: () => this.props.dispatch(refuseFriendInvite(inviteUUID)),
        },
        {
          label: '同意',
          onClick: () => this.props.dispatch(agreeFriendInvite(inviteUUID)),
        },
      ];
    } else {
      // 已处理
      if (is_agree) {
        // 已同意是好友
        return [{ label: '已同意' }];
      } else if (is_refuse) {
        // 已拒绝好友邀请
        return [{ label: '已拒绝' }];
      } else {
        return [];
      }
    }
  }
}

export default connect((state: TRPGState) => ({
  friendList: state.user.friendList,
  friendInviteCache: state.cache.friendInvite,
}))(FriendInvite);
