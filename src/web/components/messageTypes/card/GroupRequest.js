const React = require('react');
const BaseCard = require('./BaseCard');
const { connect } = require('react-redux');
const { agreeGroupRequest, refuseGroupRequest } = require('../../../../redux/actions/group');

// 入团申请
class GroupRequest extends BaseCard {
  getCardBtn() {
    let info = this.props.info;
    let data = info.data;
    let chatlogUUID = info.uuid;
    let requestUUID = data.requestUUID;
    let groupUUID = data.groupUUID;
    let fromUUID = data.fromUUID;
    let group = this.props.groups.find(g => g.get('uuid') === groupUUID);
    if(group) {
      if(group.get('group_members').includes(fromUUID)) {
        return [{label: '已同意'}];
      }else if(data.is_processed) {
        return [{label: '已处理'}]; // TODO: 需要服务端主动更新
      }else {
        return [{
          label: '同意',
          onClick: () => this.props.dispatch(agreeGroupRequest(chatlogUUID, requestUUID, fromUUID))
        }, {
          label: '拒绝',
          onClick: () => this.props.dispatch(refuseGroupRequest(chatlogUUID, requestUUID))
        }]
      }
    }else {
      return [{label: '数据异常'}];
    }
  }
}

module.exports = connect(
  state => ({
    groups: state.getIn(['group', 'groups']),
  })
)(GroupRequest);
