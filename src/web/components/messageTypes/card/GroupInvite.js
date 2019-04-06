import BaseCard from './BaseCard';
import { connect } from 'react-redux';
import {
  agreeGroupInvite,
  refuseGroupInvite,
} from '../../../../redux/actions/group';

// 入团邀请
class GroupInvite extends BaseCard {
  getCardBtn() {
    let info = this.props.info;
    let data = info.data;
    let invite = data.invite;
    let inviteIndex = this.props.groupInvites.findIndex(
      (item) => item.get('uuid') === invite.uuid
    );
    if (inviteIndex >= 0) {
      // 尚未处理
      return [
        {
          label: '拒绝',
          onClick: () => this.props.dispatch(refuseGroupInvite(invite.uuid)),
        },
        {
          label: '同意',
          onClick: () => this.props.dispatch(agreeGroupInvite(invite.uuid)),
        },
      ];
    } else {
      let groupIndex = this.props.groupUUIDList.indexOf(invite.group_uuid);
      if (groupIndex >= 0) {
        // 已同意
        return [{ label: '已同意' }];
      } else {
        // 已拒绝
        return [{ label: '已拒绝' }];
      }
    }
  }
}

export default connect((state) => ({
  groupInvites: state.getIn(['group', 'invites']),
  groupUUIDList: state
    .getIn(['group', 'groups'])
    .map((item) => item.get('uuid')),
}))(GroupInvite);
