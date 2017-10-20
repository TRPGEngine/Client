const React = require('react');
const { connect } = require('react-redux');

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
    console.log('handleSendGroupInvite');
  }

  render() {
    return (
      <div className="group-invite">
        <div className="friend-list">
          {
            this.props.friendList.map((uuid) => {
              let user = this.props.usercache.get(uuid);
              if(!user) {
                return;
              }
              
              return (
                <div
                  key={"group-invite#friend#"+uuid}
                  className={"item" + (this.state.selectedUUIDs.indexOf(uuid)>=0?' active':'')}
                  onClick={() => this._handleSelect(uuid)}
                >
                  <div className="avatar" data-tip={user.get('nickname') || user.get('username')}>
                    <img src={user.get('avatar')} />
                  </div>
                  <div className="mask"></div>
                </div>
              )
            })
          }
          <div className="item active">
            <div className="avatar">
              <img src="/src/assets/img/gugugu1.png" />
            </div>
            <div className="mask"></div>
          </div>
        </div>
        <i className="iconfont">&#xe606;</i>
        <div className="invite-list"></div>
        <button>发送邀请</button>
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
  }
)(GroupInvite);
