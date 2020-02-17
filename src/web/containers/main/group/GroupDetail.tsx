import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import config from '../../../../shared/project.config';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';
import {
  showModal,
  hideModal,
  showAlert,
  showSlidePanel,
} from '../../../../shared/redux/actions/ui';
import { sendMsg, sendFile } from '../../../../shared/redux/actions/chat';
import { changeSelectGroupActor } from '../../../../shared/redux/actions/group';
import {
  sendDiceRequest,
  sendDiceInvite,
  sendQuickDice,
} from '../../../../shared/redux/actions/dice';
// import GroupMap from './GroupMap';
import GroupInvite from './GroupInvite';
import GroupActor from './GroupActor';
import GroupMember from './GroupMember';
import GroupInfo from './GroupInfo';
import DiceRequest from '../dice/DiceRequest';
import DiceInvite from '../dice/DiceInvite';
import ListSelect from '../../../components/ListSelect';
import IsDeveloping from '../../../components/IsDeveloping';
import MsgContainer from '../../../components/MsgContainer';
import MsgSendBox from '../../../components/MsgSendBox';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';
import _orderBy from 'lodash/orderBy';
import { GroupActorMsgData } from '@src/shared/redux/types/group';
import QuickDice from '../dice/QuickDice';
import { TRPGState } from '@redux/types/__all__';

interface Props extends DispatchProp<any> {
  selectedUUID: string;
  userUUID: string;
  groupInfo: any;
  usercache: any;
  selfGroupActors: any;
  selectedGroupActorUUID: string;
  selectedGroupActorInfo: any;
}
class GroupDetail extends React.Component<Props> {
  handleSelectGroupActor = (item) => {
    if (item.value !== this.props.selectedGroupActorUUID) {
      this.props.dispatch(
        changeSelectGroupActor(this.props.selectedUUID, item.value)
      );
    }
  };

  handleSendMsg(message, type) {
    console.log('send msg:', message, 'to', this.props.selectedUUID);
    let msgData: GroupActorMsgData;
    if (!_isNil(this.props.selectedGroupActorInfo)) {
      msgData = {
        groupActorUUID: this.props.selectedGroupActorInfo.uuid,
        name: this.props.selectedGroupActorInfo.name,
        avatar: this.props.selectedGroupActorInfo.avatar,
      };
    }
    this.props.dispatch(
      sendMsg(null, {
        converse_uuid: this.props.selectedUUID,
        message,
        is_public: true,
        is_group: true,
        type,
        data: msgData,
      })
    );
  }

  // 发送文件
  handleSendFile(file) {
    console.log('send file to', this.props.selectedUUID, file);
    this.props.dispatch(
      sendFile(
        null,
        {
          converse_uuid: this.props.selectedUUID,
          is_public: true,
          is_group: true,
        },
        file
      )
    );
  }

  // 发送投骰请求
  handleSendDiceReq() {
    this.props.dispatch(
      showModal(
        <DiceRequest
          onSendDiceRequest={(diceReason, diceExp) => {
            this.props.dispatch(
              sendDiceRequest(
                this.props.selectedUUID,
                true,
                diceExp,
                diceReason
              )
            );
            this.props.dispatch(hideModal());
          }}
        />
      )
    );
  }

  // 发送投骰邀请
  handleSendDiceInv() {
    let usercache = this.props.usercache;
    let groupMembers = this.props.groupInfo.group_members ?? [];
    let list = groupMembers
      .filter((uuid) => uuid !== this.props.userUUID)
      .map((uuid) => ({
        name:
          _get(usercache, [uuid, 'nickname']) ||
          _get(usercache, [uuid, 'username']),
        uuid: _get(usercache, [uuid, 'uuid']),
      }));
    this.props.dispatch(
      showModal(
        <ListSelect
          list={list.map((i) => i.name)}
          onListSelect={(selecteds) => {
            let inviteList = list.filter((_, i) => selecteds.indexOf(i) >= 0);
            let inviteNameList = inviteList.map((i) => i.name);
            let inviteUUIDList = inviteList.map((i) => i.uuid);
            if (inviteNameList.length === 0) {
              this.props.dispatch(showAlert('请选择邀请对象'));
              return;
            }
            console.log('邀请人物选择结果', selecteds, inviteNameList);
            this.props.dispatch(
              showModal(
                <DiceInvite
                  inviteList={inviteNameList}
                  onSendDiceInvite={(diceReason, diceExp) => {
                    console.log(inviteUUIDList);
                    console.log('diceReason, diceExp', diceReason, diceExp);
                    let selectedUUID = this.props.selectedUUID;
                    this.props.dispatch(
                      sendDiceInvite(
                        selectedUUID,
                        true,
                        diceExp,
                        diceReason,
                        inviteUUIDList,
                        inviteNameList
                      )
                    );
                    this.props.dispatch(hideModal());
                  }}
                />
              )
            );
          }}
        />
      )
    );
  }

  handleQuickDice = () => {
    console.log('快速投骰');
    const uuid = this.props.selectedUUID;
    this.props.dispatch(
      showModal(
        <QuickDice
          onSendQuickDice={(diceExp) => {
            this.props.dispatch(sendQuickDice(uuid, true, diceExp));
            this.props.dispatch(hideModal());
          }}
        />
      )
    );
  };

  actions = [
    {
      name: '添加团员',
      icon: '&#xe61c;',
      component: <GroupInvite />,
    },
    {
      name: '查看团员',
      icon: '&#xe603;',
      component: <GroupMember />,
    },
    {
      name: '人物卡',
      icon: '&#xe61b;',
      component: <GroupActor />,
    },
    {
      name: '游戏地图',
      icon: '&#xe6d7;',
      // component: (
      //   <GroupMap />
      // )
      component: <IsDeveloping />,
    },
    {
      name: '游戏规则',
      icon: '&#xe621;',
      component: <IsDeveloping />,
    },
    {
      name: '团信息',
      icon: '&#xe611;',
      component: <GroupInfo />,
    },
  ];
  getHeaderActions() {
    return this.actions.map((item, index) => {
      return (
        <button
          key={'group-action-' + index}
          data-tip={item.name}
          onClick={(e) => {
            e.stopPropagation();
            this.props.dispatch(showSlidePanel(item.name, item.component));
          }}
        >
          <i
            className="iconfont"
            dangerouslySetInnerHTML={{ __html: item.icon }}
          />
        </button>
      );
    });
  }

  render() {
    let { selfGroupActors, selectedGroupActorUUID, groupInfo } = this.props;
    let options = [];
    if (selfGroupActors && selfGroupActors.length > 0) {
      options = selfGroupActors.map((item, index) => ({
        value: item.uuid,
        label: _get(item, 'actor.name'),
      }));
    }
    if (selectedGroupActorUUID) {
      options.unshift({
        value: null,
        label: '取消选择',
      });
    }
    return (
      <div className="detail">
        <ReactTooltip effect="solid" />
        <div className="group-header">
          <div className="avatar">
            <img
              src={
                groupInfo.avatar || config.defaultImg.getGroup(groupInfo.name)
              }
            />
          </div>
          <div className="title">
            <div className="main-title">
              {groupInfo.name}
              {groupInfo.status && '(开团中...)'}
            </div>
            <div className="sub-title">{groupInfo.sub_name}</div>
          </div>
          <Select
            name="actor-select"
            className="group-actor-select"
            value={selectedGroupActorUUID}
            options={options}
            clearable={false}
            searchable={false}
            placeholder="请选择身份卡"
            noResultsText="暂无身份卡..."
            onChange={this.handleSelectGroupActor}
          />
          <div className="actions">{this.getHeaderActions()}</div>
        </div>
        <MsgContainer
          className="group-content"
          converseUUID={this.props.selectedUUID}
          isGroup={true}
        />
        <MsgSendBox
          converseUUID={this.props.selectedUUID}
          isGroup={true}
          onSendMsg={(message, type) => this.handleSendMsg(message, type)}
          onSendFile={(file) => this.handleSendFile(file)}
          onSendDiceReq={() => this.handleSendDiceReq()}
          onSendDiceInv={() => this.handleSendDiceInv()}
          onQuickDice={() => this.handleQuickDice()}
        />
      </div>
    );
  }
}

export default connect((state: TRPGState) => {
  const selectedUUID = state.group.selectedGroupUUID;
  const groupInfo = state.group.groups.find(
    (group) => group.uuid === selectedUUID
  );
  const selfActors = state.actor.selfActors.map((i) => i.uuid);
  const selfGroupActors = (groupInfo.group_actors || []).filter(
    (i) => i.enabled && selfActors.indexOf(i.actor_uuid) >= 0
  );
  const selectedGroupActorUUID = _get(groupInfo, [
    'extra',
    'selected_group_actor_uuid',
  ]);
  return {
    selectedUUID,
    groupInfo,
    msgList: _orderBy(
      _get(state, ['chat', 'converses', selectedUUID, 'msgList']),
      'date'
    ),
    userUUID: state.user.info.uuid,
    usercache: state.cache.user,
    selfGroupActors,
    selectedGroupActorUUID,
    selectedGroupActorInfo: selfGroupActors.find(
      (actor) => actor.uuid === selectedGroupActorUUID
    ),
  };
})(GroupDetail);
