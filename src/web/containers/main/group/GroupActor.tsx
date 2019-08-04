import React from 'react';
import { connect } from 'react-redux';
import { selectActor } from '../../../../redux/actions/actor';
import { showAlert, showModal } from '../../../../redux/actions/ui';
import {
  addGroupActor,
  removeGroupActor,
} from '../../../../redux/actions/group';
import at from 'trpg-actor-template';
import { TabsController, Tab } from '../../../components/Tabs';
import ModalPanel from '../../../components/ModalPanel';
import ActorProfile from '../../../components/modal/ActorProfile';
import ActorSelect from '../../../components/modal/ActorSelect';
import GroupActorCheck from './modal/GroupActorCheck';
import { ActorType, ActorDataType } from '@redux/types/actor';
import { Tooltip } from 'antd';
import styled from 'styled-components';

import './GroupActor.scss';

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
}
class GroupActor extends React.Component<Props> {
  _handleSendGroupActorCheck() {
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
  _handleShowActorProfile(actor: ActorType, data: ActorDataType) {
    if (actor) {
      console.log(actor);
      this.props.showModal(
        <ModalPanel title="人物属性">
          <ActorProfile actor={actor} overwritedActorData={data} />
        </ModalPanel>
      );
    } else {
      console.error('需要actor');
    }
  }

  // 审批人物
  _handleApprove(groupActorInfo) {
    if (groupActorInfo) {
      this.props.showModal(<GroupActorCheck groupActor={groupActorInfo} />);
    } else {
      console.error('需要groupActor');
    }
  }

  // 移除团人物
  _handleRemoveGroupActor(groupActorUUID) {
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
    let groupActors = this.props.groupInfo.get('group_actors');
    if (groupActors && groupActors.size > 0) {
      return groupActors
        .filter((item) => item.get('passed') === true)
        .map((item) => {
          let originActor = item.get('actor');
          return (
            <div
              key={`group-actor#${item.get('uuid')}`}
              className="group-actor-item"
            >
              <div
                className="avatar"
                style={{
                  backgroundImage: `url(${item.get('avatar') ||
                    originActor.get('avatar')})`,
                }}
              />
              <div className="info">
                {item.get('uuid') ===
                this.props.groupInfo.getIn([
                  'extra',
                  'selected_group_actor_uuid',
                ]) ? (
                  <div className="label">使用中</div>
                ) : null}
                <div className="name">{originActor.get('name')}</div>
                <div className="desc">{originActor.get('desc')}</div>
                <div className="action">
                  <Tooltip title="查询">
                    <button
                      onClick={() =>
                        this._handleShowActorProfile(originActor.toJS(), {})
                      }
                    >
                      <i className="iconfont">&#xe61b;</i>
                    </button>
                  </Tooltip>
                  <Tooltip title="删除">
                    <button
                      onClick={() =>
                        this._handleRemoveGroupActor(item.get('uuid'))
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
                style={{ backgroundImage: `url(${originActor.get('avatar')})` }}
              />
              <div className="info">
                <div className="name">{originActor.get('name')}</div>
                <div className="desc">{originActor.get('desc')}</div>
                <div className="action">
                  <Tooltip title="查询">
                    <button
                      onClick={() =>
                        this._handleShowActorProfile(
                          originActor.toJS(),
                          actorData.toJS()
                        )
                      }
                    >
                      <i className="iconfont">&#xe61b;</i>
                    </button>
                  </Tooltip>
                  <Tooltip title="审批">
                    <button onClick={() => this._handleApprove(item.toJS())}>
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
              <button onClick={() => this._handleSendGroupActorCheck()}>
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
  (state: any) => {
    const selectedGroupUUID = state.getIn(['group', 'selectedGroupUUID']);
    return {
      selectedGroupUUID,
      groupInfo: state
        .getIn(['group', 'groups'])
        .find((group) => group.get('uuid') === selectedGroupUUID),
      templateCache: state.getIn(['cache', 'template']),
    };
  },
  (dispatch: any) => ({
    showAlert: (payload) => dispatch(showAlert(payload)),
    showModal: (body) => dispatch(showModal(body)),
    selectActor: (actorUUID: string) => dispatch(selectActor(actorUUID)),
    addGroupActor: (groupUUID: string, actorUUID: string) =>
      dispatch(addGroupActor(groupUUID, actorUUID)),
    removeGroupActor: (groupUUID: string, groupActorUUID: string) =>
      dispatch(removeGroupActor(groupUUID, groupActorUUID)),
  })
)(GroupActor);
