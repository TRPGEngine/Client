import React from 'react';
import { connect } from 'react-redux';
import config from '../../../../shared/project.config';
import {
  showAlert,
  hideAlert,
  showModal,
  hideSlidePanel,
} from '../../../../shared/redux/actions/ui';
import {
  switchSelectGroup,
  quitGroup,
  dismissGroup,
  setGroupStatus,
} from '../../../../shared/redux/actions/group';
import ImageViewer from '../../../components/ImageViewer';
import GroupEdit from '../../../components/modal/GroupEdit';
// import GroupEdit from './modal/GroupEdit';
import _get from 'lodash/get';

import './GroupInfo.scss';
import {
  TRPGState,
  TRPGDispatch,
  TRPGDispatchProp,
} from '@src/shared/redux/types/__all__';
import { AlertPayload } from '@src/shared/redux/types/ui';

interface Props extends TRPGDispatchProp {
  showModal: any;
  showAlert: any;
  hideAlert: any;
  groupInfo: any;
  switchSelectGroup: any;
  dismissGroup: any;
  hideSlidePanel: any;
  userUUID: string;
  quitGroup: any;
  setGroupStatus: any;
  usercache: any;
}
class GroupInfo extends React.Component<Props> {
  handleEditGroup() {
    console.log('编辑团信息');
    this.props.showModal(<GroupEdit />);
  }

  handleDismissGroup() {
    this.props.showAlert({
      title: '是否要解散群',
      content: '一旦确定无法撤销',
      onConfirm: () => {
        this.props.hideAlert();
        let groupUUID = this.props.groupInfo.uuid;
        this.props.switchSelectGroup('');
        this.props.dismissGroup(groupUUID);
        this.props.hideSlidePanel();
      },
    });
  }

  handleQuitGroup() {
    this.props.showAlert({
      title: '是否要退出群',
      content: '一旦确定无法撤销',
      onConfirm: () => {
        this.props.hideAlert();
        let groupUUID = this.props.groupInfo.uuid;
        this.props.switchSelectGroup('');
        this.props.quitGroup(groupUUID);
        this.props.hideSlidePanel();
      },
    });
  }

  handleSwitchGroupStatus(status = false) {
    this.props.setGroupStatus(this.props.groupInfo.uuid, status);
  }

  render() {
    let { groupInfo, usercache } = this.props;
    if (!groupInfo) {
      return null;
    }
    let avatar = groupInfo.avatar || '';
    let originAvatar = avatar.replace('/thumbnail', '');
    return (
      <div className="group-info">
        <div className="group-info-cells">
          <div className="group-info-cell group-avatar">
            <ImageViewer originImageUrl={originAvatar}>
              <img src={avatar || config.defaultImg.getGroup(groupInfo.name)} />
            </ImageViewer>
            <div>
              <p>{groupInfo.name}</p>
              <p className="group-subname" title={groupInfo.sub_name}>
                {groupInfo.sub_name}
              </p>
            </div>
          </div>
        </div>
        <div className="group-info-cells">
          <div className="group-info-cell">
            <span>团唯一标识:</span>
            <span className="uuid">{groupInfo.uuid}</span>
          </div>
          <div className="group-info-cell">
            <span>团状态:</span>
            <span>{groupInfo.status ? '开团中' : '闭团中'}</span>
          </div>
        </div>
        <div className="group-info-cells">
          <div className="group-info-cell">
            <span>团主持人:</span>
            <span>{_get(usercache, [groupInfo.owner_uuid, 'nickname'])}</span>
          </div>
          <div className="group-info-cell">
            <span>团管理数:</span>
            <span>{groupInfo.managers_uuid.length} 人</span>
          </div>
          <div className="group-info-cell">
            <span>团成员数:</span>
            <span>{groupInfo.group_members.length} 人</span>
          </div>
          <div className="group-info-cell">
            <span>团人物卡数:</span>
            <span>{groupInfo.group_actors.length} 张</span>
          </div>
          <div className="group-info-cell">
            <span>团地图数:</span>
            <span>{groupInfo.maps_uuid.length} 张</span>
          </div>
          <div className="group-info-cell">
            <span>团简介:</span>
            <span className="desc">
              <pre>{groupInfo.desc}</pre>
            </span>
          </div>
        </div>

        {this.props.userUUID === groupInfo.owner_uuid ? (
          <div>
            <div className="group-info-cells">
              <div className="group-info-cell">
                {groupInfo.status ? (
                  <button onClick={() => this.handleSwitchGroupStatus(false)}>
                    闭团
                  </button>
                ) : (
                  <button onClick={() => this.handleSwitchGroupStatus(true)}>
                    开团
                  </button>
                )}
              </div>
            </div>
            <div className="group-info-cells">
              <div className="group-info-cell">
                <button onClick={() => this.handleEditGroup()}>编辑团</button>
              </div>
              <div className="group-info-cell">
                <button onClick={() => this.handleDismissGroup()}>
                  解散团
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="group-info-cells">
              <div className="group-info-cell">
                <button onClick={() => this.handleQuitGroup()}>退出团</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  (state: TRPGState) => ({
    userUUID: state.user.info.uuid,
    usercache: state.cache.user,
    selectedGroupUUID: state.group.selectedGroupUUID,
    groupInfo: state.group.groups.find(
      (group) => group.uuid === state.group.selectedGroupUUID
    ),
  }),
  (dispatch: TRPGDispatch) => ({
    showAlert: (payload: AlertPayload) => dispatch(showAlert(payload)),
    hideAlert: () => dispatch(hideAlert()),
    showModal: (body) => dispatch(showModal(body)),
    switchSelectGroup: (groupUUID) => dispatch(switchSelectGroup(groupUUID)),
    quitGroup: (groupUUID) => dispatch(quitGroup(groupUUID)),
    dismissGroup: (groupUUID) => dispatch(dismissGroup(groupUUID)),
    setGroupStatus: (groupUUID, groupStatus) =>
      dispatch(setGroupStatus(groupUUID, groupStatus)),
    hideSlidePanel: () => dispatch(hideSlidePanel()),
  })
)(GroupInfo);
