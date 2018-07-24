const React = require('react');
const { connect } = require('react-redux');
const config = require('../../../../../config/project.config');
const { showAlert, hideAlert, showModal, hideSlidePanel } = require('../../../../redux/actions/ui');
const { switchSelectGroup, quitGroup, dismissGroup, setGroupStatus } = require('../../../../redux/actions/group');
const ImageViewer = require('../../../components/ImageViewer');
const GroupEdit = require('../../../components/modal/GroupEdit');
// const GroupEdit = require('./modal/GroupEdit');

require('./GroupInfo.scss')

class GroupInfo extends React.Component {
  _handleEditGroup() {
    console.log('编辑团信息');
    this.props.showModal(
      <GroupEdit />
    )
  }

  _handleDismissGroup() {
    this.props.showAlert({
      title: '是否要解散群',
      content: '一旦确定无法撤销',
      onConfirm: () => {
        this.props.hideAlert();
        let groupUUID = this.props.groupInfo.get('uuid');
        this.props.switchSelectGroup('');
        this.props.dismissGroup(groupUUID);
        this.props.hideSlidePanel();
      }
    })
  }

  _handleQuitGroup() {
    this.props.showAlert({
      title: '是否要退出群',
      content: '一旦确定无法撤销',
      onConfirm: () => {
        this.props.hideAlert();
        let groupUUID = this.props.groupInfo.get('uuid');
        this.props.switchSelectGroup('');
        this.props.quitGroup(groupUUID);
        this.props.hideSlidePanel();
      }
    })
  }

  _handleSwitchGroupStatus(status = false) {
    this.props.setGroupStatus(this.props.groupInfo.get('uuid'), status);
  }

  render() {
    let {groupInfo, usercache} = this.props;
    if (!groupInfo) {
      return null;
    }
    let avatar = groupInfo.get('avatar') || '';
    let originAvatar = avatar.replace('/thumbnail', '');
    return (
      <div className="group-info">
        <div className="group-props">
          <div><ImageViewer originImageUrl={originAvatar}><img src={avatar || config.defaultImg.group} /></ImageViewer></div>
          <div><span>团唯一标识: </span><span className="uuid">{groupInfo.get('uuid')}</span></div>
          <div><span>团名:</span><span>{groupInfo.get('name')}</span></div>
          <div><span>团副名:</span><span>{groupInfo.get('sub_name')}</span></div>
          <div><span>团状态:</span><span>{groupInfo.get('status') ? '开团中' : '闭团中'}</span></div>
          <div><span>团主:</span><span>{usercache.getIn([groupInfo.get('owner_uuid'), 'nickname'])}</span></div>
          <div><span>团人物卡数:</span><span>{groupInfo.get('group_actors').size} 张</span></div>
          <div><span>团成员数:</span><span>{groupInfo.get('group_members').size} 人</span></div>
          <div><span>团管理数:</span><span>{groupInfo.get('managers_uuid').size} 人</span></div>
          <div><span>团地图数:</span><span>{groupInfo.get('maps_uuid').size} 张</span></div>
          <div><span>团简介:</span><span className="desc"><pre>{groupInfo.get('desc')}</pre></span></div>
        </div>
        {
          this.props.userUUID === groupInfo.get('owner_uuid') ? (
            <div className="group-actions">
              {
                groupInfo.get('status') ? (
                  <button onClick={() => this._handleSwitchGroupStatus(false)}>闭团</button>
                ) : (
                  <button onClick={() => this._handleSwitchGroupStatus(true)}>开团</button>
                )
              }
              <button onClick={() => this._handleEditGroup()}>编辑团</button>
              <button onClick={() => this._handleDismissGroup()}>解散团</button>
            </div>
          ) : (
            <div className="group-actions">
              <button onClick={() => this._handleQuitGroup()}>退出团</button>
            </div>
          )
        }
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    userUUID: state.getIn(['user', 'info', 'uuid']),
    usercache: state.getIn(['cache', 'user']),
    selectedGroupUUID: state.getIn(['group', 'selectedGroupUUID']),
    groupInfo: state
      .getIn(['group', 'groups'])
      .find((group) => group.get('uuid')===state.getIn(['group', 'selectedGroupUUID'])),
  }),
  dispatch => ({
    showAlert: (...args) => dispatch(showAlert(...args)),
    hideAlert: () => dispatch(hideAlert()),
    showModal: (...args) => dispatch(showModal(...args)),
    switchSelectGroup: (groupUUID) => dispatch(switchSelectGroup(groupUUID)),
    quitGroup: (groupUUID) => dispatch(quitGroup(groupUUID)),
    dismissGroup: (groupUUID) => dispatch(dismissGroup(groupUUID)),
    setGroupStatus: (groupUUID, groupStatus) => dispatch(setGroupStatus(groupUUID, groupStatus)),
    hideSlidePanel: () => dispatch(hideSlidePanel()),
  })
)(GroupInfo);
