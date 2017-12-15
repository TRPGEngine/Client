const React = require('react');
const { connect } = require('react-redux');
const { tickMember } = require('../../../../redux/actions/group');

require('./GroupMemberManage.scss')

class GroupMemberManage extends React.Component {
  _handleRaiseManager() {
    // TODO
    console.log('提升为管理');
  }

  _handleTickGroup() {
    this.props.dispatch(tickMember(this.props.selectedGroupUUID, this.props.uuid))
  }

  render() {
    let userInfo = this.props.usercache.get(this.props.uuid);
    return (
      <div className="group-member-manage">
        <p>{userInfo.get('nickname') || userInfo.get('username')}</p>
        <div>{userInfo.get('uuid')}</div>
        <button onClick={() => this._handleRaiseManager()}>提升为管理</button>
        <button onClick={() => this._handleTickGroup()}>踢出本团</button>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    usercache: state.getIn(['cache', 'user']),
    selectedGroupUUID: state.getIn(['group', 'selectedGroupUUID']),
  })
)(GroupMemberManage);
