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
        let groupUUID = this.props.groupInfo.get('uuid');
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
        let groupUUID = this.props.groupInfo.get('uuid');
        this.props.switchSelectGroup('');
        this.props.quitGroup(groupUUID);
        this.props.hideSlidePanel();
      },
    });
  }

  handleSwitchGroupStatus(status = false) {
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
              <img
                src={
                  avatar || config.defaultImg.getGroup(groupInfo.get('name'))
                }
              />
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
            <span>团主持人:</span>
            <span>
              {_get(usercache, [groupInfo.get('owner_uuid'), 'nickname'])}
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
