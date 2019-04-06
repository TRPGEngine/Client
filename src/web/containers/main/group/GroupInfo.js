import React from 'react';
import { connect } from 'react-redux';
import config from '../../../../../config/project.config';
import {
  showAlert,
  hideAlert,
  showModal,
  hideSlidePanel,
} from '../../../../redux/actions/ui';
import {
  switchSelectGroup,
  quitGroup,
  dismissGroup,
  setGroupStatus,
} from '../../../../redux/actions/group';
import ImageViewer from '../../../components/ImageViewer';
import GroupEdit from '../../../components/modal/GroupEdit';
// import GroupEdit from './modal/GroupEdit';

import './GroupInfo.scss';

class GroupInfo extends React.Component {
  _handleEditGroup() {
    console.log('编辑团信息');
    this.props.showModal(<GroupEdit />);
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
      },
    });
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
      },
    });
  }

  _handleSwitchGroupStatus(status = false) {
    this.props.setGroupStatus(this.props.groupInfo.get('uuid'), status);
  }

  render() {
    let { groupInfo, usercache } = this.props;
    if (!groupInfo) {
      return null;
    }
    let avatar = groupInfo.get('avatar') || '';
    let originAvatar = avatar.replace('/thumbnail', '');
    return (
      <div className="group-info">
        <div className="group-info-cells">
          <div className="group-info-cell group-avatar">
            <ImageViewer originImageUrl={originAvatar}>
              <img src={avatar || config.defaultImg.group} />
            </ImageViewer>
            <div>
              <p>{groupInfo.get('name')}</p>
              <p className="group-subname" title={groupInfo.get('sub_name')}>
                {groupInfo.get('sub_name')}
              </p>
            </div>
          </div>
        </div>
        <div className="group-info-cells">
          <div className="group-info-cell">
            <span>团唯一标识:</span>
            <span className="uuid">{groupInfo.get('uuid')}</span>
          </div>
          <div className="group-info-cell">
            <span>团状态:</span>
            <span>{groupInfo.get('status') ? '开团中' : '闭团中'}</span>
          </div>
        </div>
        <div className="group-info-cells">
          <div className="group-info-cell">
            <span>团长:</span>
            <span>
              {usercache.getIn([groupInfo.get('owner_uuid'), 'nickname'])}
            </span>
          </div>
          <div className="group-info-cell">
            <span>团管理数:</span>
            <span>{groupInfo.get('managers_uuid').size} 人</span>
          </div>
          <div className="group-info-cell">
            <span>团成员数:</span>
            <span>{groupInfo.get('group_members').size} 人</span>
          </div>
          <div className="group-info-cell">
            <span>团人物卡数:</span>
            <span>{groupInfo.get('group_actors').size} 张</span>
          </div>
          <div className="group-info-cell">
            <span>团地图数:</span>
            <span>{groupInfo.get('maps_uuid').size} 张</span>
          </div>
          <div className="group-info-cell">
            <span>团简介:</span>
            <span className="desc">
              <pre>{groupInfo.get('desc')}</pre>
            </span>
          </div>
        </div>

        {this.props.userUUID === groupInfo.get('owner_uuid') ? (
          <div>
            <div className="group-info-cells">
              <div className="group-info-cell">
                {groupInfo.get('status') ? (
                  <button onClick={() => this._handleSwitchGroupStatus(false)}>
                    闭团
                  </button>
                ) : (
                  <button onClick={() => this._handleSwitchGroupStatus(true)}>
                    开团
                  </button>
                )}
              </div>
            </div>
            <div className="group-info-cells">
              <div className="group-info-cell">
                <button onClick={() => this._handleEditGroup()}>编辑团</button>
              </div>
              <div className="group-info-cell">
                <button onClick={() => this._handleDismissGroup()}>
                  解散团
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="group-info-cells">
              <div className="group-info-cell">
                <button onClick={() => this._handleQuitGroup()}>退出团</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  (state) => ({
    userUUID: state.getIn(['user', 'info', 'uuid']),
    usercache: state.getIn(['cache', 'user']),
    selectedGroupUUID: state.getIn(['group', 'selectedGroupUUID']),
    groupInfo: state
      .getIn(['group', 'groups'])
      .find(
        (group) =>
          group.get('uuid') === state.getIn(['group', 'selectedGroupUUID'])
      ),
  }),
  (dispatch) => ({
    showAlert: (...args) => dispatch(showAlert(...args)),
    hideAlert: () => dispatch(hideAlert()),
    showModal: (...args) => dispatch(showModal(...args)),
    switchSelectGroup: (groupUUID) => dispatch(switchSelectGroup(groupUUID)),
    quitGroup: (groupUUID) => dispatch(quitGroup(groupUUID)),
    dismissGroup: (groupUUID) => dispatch(dismissGroup(groupUUID)),
    setGroupStatus: (groupUUID, groupStatus) =>
      dispatch(setGroupStatus(groupUUID, groupStatus)),
    hideSlidePanel: () => dispatch(hideSlidePanel()),
  })
)(GroupInfo);
