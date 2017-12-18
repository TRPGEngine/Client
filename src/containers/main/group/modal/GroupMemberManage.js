const React = require('react');
const { connect } = require('react-redux');
const { tickMember, setMemberToManager } = require('../../../../redux/actions/group');
const ModalPanel = require('../../../../components/ModalPanel');
const config = require('../../../../../config/project.config');

require('./GroupMemberManage.scss')

class GroupMemberManage extends React.Component {
  _handleRaiseManager() {
    this.props.dispatch(setMemberToManager(this.props.selectedGroupUUID, this.props.uuid));
  }

  _handleTickGroup() {
    this.props.dispatch(tickMember(this.props.selectedGroupUUID, this.props.uuid))
  }

  render() {
    let userInfo = this.props.usercache.get(this.props.uuid);
    let actions = (
      <div>
        <button onClick={() => this._handleRaiseManager()}>提升为管理</button>
        <button onClick={() => this._handleTickGroup()}>踢出本团</button>
      </div>
    )
    return (
      <ModalPanel title="管理成员" actions={actions}>
        <div className="group-member-manage">
          <div className="avatar">
            <img src={userInfo.get('avatar') || config.defaultImg.user} />
          </div>
          <div className="uuid">{userInfo.get('uuid')}</div>
          <p className="name">{userInfo.get('nickname') || userInfo.get('username')}</p>
          <p className="sign">{userInfo.get('sign')}</p>
        </div>
      </ModalPanel>
    )
  }
}

module.exports = connect(
  state => ({
    usercache: state.getIn(['cache', 'user']),
    selectedGroupUUID: state.getIn(['group', 'selectedGroupUUID']),
  })
)(GroupMemberManage);
