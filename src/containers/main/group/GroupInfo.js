const React = require('react');
const { connect } = require('react-redux');

require('./GroupInfo.scss')

class GroupInfo extends React.Component {
  render() {
    let {groupInfo, usercache} = this.props;
    return (
      <div className="group-info">
        <div><span>团唯一标识: </span><span className="uuid">{groupInfo.get('uuid')}</span></div>
        <div><span>团名:</span><span>{groupInfo.get('name')}</span></div>
        <div><span>团主:</span><span>{usercache.getIn([groupInfo.get('owner_uuid'), 'username'])}</span></div>
        <div><span>团人物卡数:</span><span>{groupInfo.get('group_actors').size}张</span></div>
        <div><span>团成员数:</span><span>{groupInfo.get('group_members').size}人</span></div>
        <div><span>团管理数:</span><span>{groupInfo.get('managers_uuid').size}人</span></div>
        <div><span>团地图数:</span><span>{groupInfo.get('maps_uuid').size}张</span></div>
        <div><span>团简介:</span><span className="desc">{groupInfo.get('desc')}</span></div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    usercache: state.getIn(['cache', 'user']),
    selectedGroupUUID: state.getIn(['group', 'selectedGroupUUID']),
    groupInfo: state
      .getIn(['group', 'groups'])
      .find((group) => group.get('uuid')===state.getIn(['group', 'selectedGroupUUID'])),
  }),
)(GroupInfo);
