import BaseCard from './BaseCard';
import { connect, DispatchProp } from 'react-redux';
import {
  agreeGroupInvite,
  refuseGroupInvite,
} from '@shared/redux/actions/group';
import { MessageProps } from '@shared/components/MessageHandler';
import { TRPGState } from '@src/shared/redux/types/__all__';
import { getGroupInviteInfoCache } from '@shared/utils/cache-helper';
import _get from 'lodash/get';

interface Props extends MessageProps, DispatchProp<any> {
  groupUUIDList: any;
}

// 入团邀请
class GroupInvite extends BaseCard<Props> {
  getCardBtn() {
    const info = this.props.info;
    const data = info.data;
    const inviteUUID = _get(data, 'invite.uuid');
    const inviteInfo = getGroupInviteInfoCache(inviteUUID);
    const is_agree = inviteInfo.get('is_agree', false);
    const is_refuse = inviteInfo.get('is_refuse', false);

    const processed = is_agree || is_refuse;

    if (!processed) {
      // 尚未处理
      return [
        {
          label: '拒绝',
          onClick: () => this.props.dispatch(refuseGroupInvite(inviteUUID)),
        },
        {
          label: '同意',
          onClick: () => this.props.dispatch(agreeGroupInvite(inviteUUID)),
        },
      ];
    } else {
      // 已处理
      if (is_agree) {
        // 已同意
        return [{ label: '已同意' }];
      } else if (is_refuse) {
        // 已拒绝
        return [{ label: '已拒绝' }];
      } else {
        return [];
      }
    }
  }
}

export default connect((state: TRPGState) => ({
  groupInviteCache: state.cache.groupInvite,
  groupUUIDList: state.group.groups.map((item) => item.uuid),
}))(GroupInvite);
