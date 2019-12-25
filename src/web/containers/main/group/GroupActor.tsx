import React from 'react';
import { connect } from 'react-redux';
import { selectActor } from '@src/shared/redux/actions/actor';
import { showAlert, showModal } from '@src/shared/redux/actions/ui';
import {
  addGroupActor,
  removeGroupActor,
  updateGroupActorInfo,
} from '@src/shared/redux/actions/group';
import { TabsController, Tab } from '../../../components/Tabs';
import ModalPanel from '../../../components/ModalPanel';
import ActorProfile from '../../../components/modal/ActorProfile';
import ActorSelect from '../../../components/modal/ActorSelect';
import GroupActorCheck from './modal/GroupActorCheck';
import { ActorType, ActorDataType } from '@src/shared/redux/types/actor';
import { GroupActorType } from '@src/shared/redux/types/group';
import ActorEdit from '@src/web/components/modal/ActorEdit';
import { Tooltip } from 'antd';
import styled from 'styled-components';
import {
  getGroupActorInfo,
  getGroupActorField,
} from '@src/web/utils/data-helper';
import { getTemplateInfoCache } from '@src/shared/utils/cache-helper';
import _get from 'lodash/get';

import './GroupActor.scss';
import { getAbsolutePath } from '@shared/utils/file-helper';
import { TRPGState } from '@redux/types/__all__';

const GroupActorAction = styled.div`
  padding: 4px 10px;
`;

interface Props {
  selectedGroupUUID: string;
  showModal: any;
  showAlert: any;
  addGroupActor: any;
  removeGroupActor: any;
  groupInfo: any;
  templateCache: any;
  updateGroupActorInfo: (
    groupUUID: string,
    groupActorUUID: string,
    groupActorInfo: {}
  ) => void;
}
class GroupActor extends React.Component<Props> {
  handleSendGroupActorCheck() {
    if (!this.props.selectedGroupUUID) {
      showAlert('请选择一个团来提交您的人物');
    }

    this.props.showModal(
      <ActorSelect
        onSelect={(actorUUID) => {
          this.props.addGroupActor(this.props.selectedGroupUUID, actorUUID);
        }}
      />
    );
  }

  // 查看人物卡
  handleShowActorProfile(actor: ActorType, overwritedActorData: ActorDataType) {
    if (actor) {
      this.props.showModal(
        <ModalPanel title="人物属性">
          <ActorProfile
            actor={actor}
            overwritedActorData={overwritedActorData}
          />
        </ModalPanel>
      );
    } else {
      console.error('需要actor');
    }
  }

  /**
   * 处理团人物卡信息的编辑
   * @param groupActor 团人物卡
   */
  handleEditActorInfo(groupActor: GroupActorType) {
    const { showModal, groupInfo, updateGroupActorInfo } = this.props;
    const template = getTemplateInfoCache(
      _get(groupActor, 'actor.template_uuid')
    );
    const templateLayout = template.get('layout');

    showModal(
      <ActorEdit
        name={groupActor.name}
        avatar={groupActor.avatar}
        desc={groupActor.desc}
        data={getGroupActorInfo(groupActor)}
        layout={templateLayout}
        onSave={(data) =>
          updateGroupActorInfo(groupInfo.get('uuid'), groupActor.uuid, data)
        }
      />
    );
  }

  // 审批人物
  handleApprove(groupActorInfo) {
    if (groupActorInfo) {
      this.props.showModal(<GroupActorCheck groupActor={groupActorInfo} />);
    } else {
      console.error('需要groupActor');
    }
  }

  // 移除团人物
  handleRemoveGroupActor(groupActorUUID) {
    this.props.showAlert({
      content: '你确定要删除该人物卡么？删除后无法找回',
      onConfirm: () =>
        this.props.removeGroupActor(
          this.props.selectedGroupUUID,
          groupActorUUID
        ),
    });
  }

  // 正式人物卡
  getGroupActorsList() {
    const { groupInfo } = this.props;
    const groupActors = this.props.groupInfo.get('group_actors');
    if (groupActors && groupActors.size > 0) {
      return groupActors
        .filter((item) => item.get('passed') === true)
        .map((item) => {
          const groupActor: GroupActorType = item.toJS(); // 团人物卡信息
          const originActor: ActorType = groupActor.actor;
          const groupActorUUID = groupActor.uuid;

          return (
            <div
              key={`group-actor#${groupActorUUID}`}
              className="group-actor-item"
            >
              <div
                className="avatar"
                style={{
                  backgroundImage: `url(${getAbsolutePath(
                    getGroupActorField(groupActor, 'avatar')
                  )})`,
                }}
              />
              <div className="info">
                {groupActorUUID ===
                groupInfo.getIn(['extra', 'selected_group_actor_uuid']) ? (
                  <div className="label">使用中</div>
                ) : null}
                <div className="name">
                  {getGroupActorField(groupActor, 'name')}
                </div>
                <div className="desc">
                  {getGroupActorField(groupActor, 'desc')}
                </div>
                <div className="action">
                  <Tooltip title="查询">
                    <button
                      onClick={() =>
                        this.handleShowActorProfile(
                          originActor,
                          groupActor.actor_info
                        )
                      }
                    >
                      <i className="iconfont">&#xe61b;</i>
                    </button>
                  </Tooltip>
                  <Tooltip title="编辑">
                    <button
                      onClick={() => this.handleEditActorInfo(groupActor)}
                    >
                      <i className="iconfont">&#xe612;</i>
                    </button>
                  </Tooltip>
                  <Tooltip title="删除">
                    <button
                      onClick={() =>
                        this.handleRemoveGroupActor(groupActorUUID)
                      }
                    >
                      <i className="iconfont">&#xe76b;</i>
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          );
        });
    } else {
      return <div className="no-content">暂无卡片</div>;
    }
  }

  // 待审人物卡
  getGroupActorChecksList() {
    let groupActors = this.props.groupInfo.get('group_actors');
    if (groupActors && groupActors.size > 0) {
      return groupActors
        .filter((item) => item.get('passed') === false)
        .map((item) => {
          let originActor = item.get('actor');
          let actorData = item.get('actor_info');
          return (
            <div
              key={'group-actor-check#' + item.get('uuid')}
              className="group-actor-check-item"
            >
              <div
                className="avatar"
                style={{
                  backgroundImage: `url(${getAbsolutePath(
                    originActor.get('avatar')
                  )})`,
                }}
              />
              <div className="info">
                <div className="name">{originActor.get('name')}</div>
                <div className="desc">{originActor.get('desc')}</div>
                <div className="action">
                  <Tooltip title="查询">
                    <button
                      onClick={() =>
                        this.handleShowActorProfile(
                          originActor.toJS(),
                          actorData.toJS()
                        )
                      }
                    >
                      <i className="iconfont">&#xe61b;</i>
                    </button>
                  </Tooltip>
                  <Tooltip title="审批">
                    <button onClick={() => this.handleApprove(item.toJS())}>
                      <i className="iconfont">&#xe83f;</i>
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          );
        });
    } else {
      return <div className="no-content">暂无卡片</div>;
    }
  }

  render() {
    return (
      <div className="group-actor">
        <TabsController>
          <Tab name="正式人物卡">
            <div className="formal-actor">
              <div className="group-actor-items">
                {this.getGroupActorsList()}
              </div>
            </div>
          </Tab>
          <Tab name="待审人物卡">
            <div className="reserve-actor">
              <div className="group-actor-check-items">
                {this.getGroupActorChecksList()}
              </div>
            </div>
            <GroupActorAction>
              <button onClick={() => this.handleSendGroupActorCheck()}>
                <i className="iconfont">&#xe604;</i>申请审核
              </button>
            </GroupActorAction>
          </Tab>
        </TabsController>
      </div>
    );
  }
}

export default connect(
  (state: TRPGState) => {
    const selectedGroupUUID = state.group.selectedGroupUUID;
    return {
      selectedGroupUUID,
      groupInfo: state
        .getIn(['group', 'groups'])
        .find((group) => group.get('uuid') === selectedGroupUUID),
      templateCache: state.cache.template,
    };
  },
  (dispatch: any, ownProps) => ({
    showAlert: (payload) => dispatch(showAlert(payload)),
    showModal: (body) => dispatch(showModal(body)),
    selectActor: (actorUUID: string) => dispatch(selectActor(actorUUID)),
    addGroupActor: (groupUUID: string, actorUUID: string) =>
      dispatch(addGroupActor(groupUUID, actorUUID)),
    removeGroupActor: (groupUUID: string, groupActorUUID: string) =>
      dispatch(removeGroupActor(groupUUID, groupActorUUID)),
    updateGroupActorInfo: (
      groupUUID: string,
      groupActorUUID: string,
      groupActorInfo: {}
    ) =>
      dispatch(updateGroupActorInfo(groupUUID, groupActorUUID, groupActorInfo)),
  })
)(GroupActor);
