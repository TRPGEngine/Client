const React = require('react');
const { connect } = require('react-redux');
const config = require('../../../../config/project.config.js');
const ReactTooltip = require('react-tooltip');
const { sendGroupInvite } = require('../../../redux/actions/group');

require('./GroupInvite.scss')

class GroupInvite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUUIDs: []
    }
  }

  _handleSelect(uuid) {
    let selectedUUIDs = this.state.selectedUUIDs;
    let index = selectedUUIDs.indexOf(uuid)
    if(index >= 0) {
      selectedUUIDs.splice(index, 1);
      this.setState({selectedUUIDs: selectedUUIDs});
    }else {
      selectedUUIDs.push(uuid);
      this.setState({selectedUUIDs: selectedUUIDs});
    }
  }

  _handleSendGroupInvite() {
    console.log('handleSendGroupInvite', this.state.selectedUUIDs);
    let groupUUID = this.props.selectedGroupUUID;
    for (let uuid of this.state.selectedUUIDs) {
      // TODO 需要一个待处理的group邀请列表，防止多次提交邀请
      this.props.sendGroupInvite(groupUUID, uuid);
    }
  }

  render() {
    return (
      <div className="group-invite">
        <ReactTooltip effect="solid" />
        <div className="friend-list">
          {
            this.props.friendList.map((uuid) => {
              if(this.props.groupMembers.indexOf(uuid) >= 0) {
                return;
              }

              let user = this.props.usercache.get(uuid);
              if(!user) {
                return;
              }

              return (
                <div
                  key={"group-invite#friend#"+uuid}
                  className={"item" + (this.state.selectedUUIDs.indexOf(uuid)>=0?' active':'')}
                  onClick={() => this._handleSelect(uuid)}
                  data-tip={user.get('nickname') || user.get('username')}
                >
                  <div className="avatar">
                    <img src={user.get('avatar') || config.defaultImg.user} />
                  </div>
                  <div className="mask"></div>
                </div>
              )
            })
          }
        </div>
        <i className="iconfont">&#xe606;</i>
        <div className="invite-list">
          {
            this.props.groupMembers.map((uuid) => {
              let user = this.props.usercache.get(uuid);
              if(!user) {
                return;
              }

              return (
                <div
                  key={"group-invite#groupMembers#"+uuid}
                  className={"item-solid"}
                  onClick={() => console.log(uuid)}
                  data-tip={user.get('nickname') || user.get('username')}
                >
                  <div className="avatar">
                    <img src={user.get('avatar') || config.defaultImg.user} />
                  </div>
                  <div className="mask"></div>
                </div>
              )
            })
          }
        </div>
        <button onClick={() => this._handleSendGroupInvite()}>发送邀请</button>
      </div>
    )
  }
}

module.exports = connect(
  state => {
    let selectedGroupUUID = state.getIn(['group', 'selectedGroupUUID']);
    let groupInfo = state
      .getIn(['group', 'groups'])
      .find(group => group.get('uuid')===selectedGroupUUID)
    return {
      usercache: state.getIn(['cache', 'user']),
      friendList: state.getIn(['user', 'friendList']),
      selectedGroupUUID,
      groupInfo,
      groupMembers: groupInfo.get('group_members'),
    }
  },
  dispatch => ({
    sendGroupInvite: (group_uuid, to_uuid) => dispatch(sendGroupInvite(group_uuid, to_uuid)),
  })
)(GroupInvite);
