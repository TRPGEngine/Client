const React = require('react');
const { connect } = require('react-redux');
const config = require('../../../../../config/project.config.js');
const Select = require('react-select');
const ReactTooltip = require('react-tooltip');
const { showModal, hideModal, showAlert, showSlidePanel } = require('../../../../redux/actions/ui');
const { sendMsg } = require('../../../../redux/actions/chat');
const { changeSelectGroupActor } = require('../../../../redux/actions/group');
const { sendDiceRequest, sendDiceInvite } = require('../../../../redux/actions/dice');
// const GroupMap = require('./GroupMap');
const GroupInvite = require('./GroupInvite');
const GroupActor = require('./GroupActor');
const GroupMember = require('./GroupMember');
const GroupInfo = require('./GroupInfo');
const DiceRequest = require('../dice/DiceRequest');
const DiceInvite = require('../dice/DiceInvite');
const ListSelect = require('../../../components/ListSelect');
const IsDeveloping = require('../../../components/IsDeveloping');
const MsgContainer = require('../../../components/MsgContainer');
const MsgSendBox = require('../../../components/MsgSendBox');

class GroupDetail extends React.Component {
  _handleSelectGroupActor(item) {
    if(item.value !== this.props.selectedGroupActorUUID) {
      this.props.dispatch(changeSelectGroupActor(this.props.selectedUUID, item.value));
    }
  }

  _handleSendMsg(message, type) {
    console.log('send msg:', message, 'to', this.props.selectedUUID);
    this.props.dispatch(sendMsg(null, {
      converse_uuid: this.props.selectedUUID,
      message,
      is_public: true,
      is_group: true,
      type,
    }));
  }

  // 发送投骰请求
  _handleSendDiceReq() {
    this.props.dispatch(showModal(
      <DiceRequest
        onSendDiceRequest={(diceReason, diceExp) => {
          this.props.dispatch(sendDiceRequest(this.props.selectedUUID, true, diceExp, diceReason));
          this.props.dispatch(hideModal());
        }}
      />
    ))
  }

  // 发送投骰邀请
  _handleSendDiceInv() {
    let usercache = this.props.usercache;
    let groupMembers = this.props.groupInfo.get('group_members');
    let list = groupMembers
      .filter(uuid => uuid !== this.props.userUUID)
      .map(uuid => ({
        name: usercache.getIn([uuid, 'nickname']) || usercache.getIn([uuid, 'username']),
        uuid: usercache.getIn([uuid, 'uuid']),
      }));
    this.props.dispatch(showModal(
      <ListSelect
        list={list.map((i)=>i.name)}
        onListSelect={(selecteds) => {
          let inviteList = list.filter((_, i) => selecteds.indexOf(i) >= 0).toJS();
          let inviteNameList = inviteList.map((i)=>i.name);
          let inviteUUIDList = inviteList.map((i)=>i.uuid);
          if(inviteNameList.length === 0) {
            this.props.dispatch(showAlert('请选择邀请对象'))
            return;
          }
          console.log('邀请人物选择结果', selecteds, inviteNameList);
          this.props.dispatch(showModal(
            <DiceInvite
              inviteList={inviteNameList}
              onSendDiceInvite={(diceReason, diceExp) => {
                console.log(inviteUUIDList);
                console.log('diceReason, diceExp',diceReason, diceExp);
                let selectedUUID = this.props.selectedUUID;
                this.props.dispatch(sendDiceInvite(selectedUUID, true, diceExp, diceReason, inviteUUIDList, inviteNameList));
                this.props.dispatch(hideModal());
              }}
            />
          ))
        }}
      />
    ))
  }

  getHeaderActions() {
    const actions = [
      {
        name: '添加团员',
        icon: '&#xe61c;',
        component: (
          <GroupInvite />
        )
      },
      {
        name: '查看团员',
        icon: '&#xe603;',
        component: (
          <GroupMember />
        ),
      },
      {
        name: '游戏地图',
        icon: '&#xe6d7;',
        // component: (
        //   <GroupMap />
        // )
        component: (
          <IsDeveloping />
        )
      },
      {
        name: '游戏规则',
        icon: '&#xe621;',
        component: (
          <IsDeveloping />
        )
      },
      {
        name: '人物卡',
        icon: '&#xe61b;',
        component: (
          <GroupActor />
        )
      },
      {
        name: '团信息',
        icon: '&#xe611;',
        component: (
          <GroupInfo />
        )
      },
    ]

    return actions.map((item, index) => {
      return (
        <button
          key={'group-action-'+index}
          data-tip={item.name}
          onClick={(e) => {
            e.stopPropagation();
            this.props.dispatch(showSlidePanel(item.name, item.component))
          }}
        >
          <i className="iconfont" dangerouslySetInnerHTML={{__html: item.icon}}></i>
        </button>
      )
    })
  }

  render() {
    let { selfGroupActors, selectedGroupActorUUID, groupInfo } = this.props;
    let options = [];
    if(selfGroupActors && selfGroupActors.size > 0) {
      options = selfGroupActors.map((item, index) => ({
        value: item.get('uuid'),
        label: item.getIn(['actor', 'name']),
      })).toJS();
    }
    if(selectedGroupActorUUID) {
      options.unshift({
        value: null,
        label: '取消选择',
      })
    }
    return (
      <div className="detail">
        <ReactTooltip effect="solid" />
        <div className="group-header">
          <div className="avatar">
            <img src={groupInfo.get('avatar') || config.defaultImg.group} />
          </div>
          <div className="title">
            <div className="main-title">{groupInfo.get('name')}{groupInfo.get('status') && '(开团中...)'}</div>
            <div className="sub-title">{groupInfo.get('sub_name')}</div>
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
            onChange={(item) => this._handleSelectGroupActor(item)}
          />
          <div className="actions">
            {this.getHeaderActions()}
          </div>
        </div>
        <MsgContainer className="group-content" converseUUID={this.props.selectedUUID} isGroup={true} />
        <MsgSendBox
          converseUUID={this.props.selectedUUID}
          isGroup={true}
          onSendMsg={(message, type) => this._handleSendMsg(message, type)}
          onSendDiceReq={() => this._handleSendDiceReq()}
          onSendDiceInv={() => this._handleSendDiceInv()}
        />
      </div>
    )
  }
}

module.exports = connect(
  state => {
    let selectedUUID = state.getIn(['group', 'selectedGroupUUID']);
    let groupInfo = state
      .getIn(['group', 'groups'])
      .find((group) => group.get('uuid')===selectedUUID);
    let selfActors = state.getIn(['actor', 'selfActors']).map((i) => i.get('uuid'));
    return {
      selectedUUID,
      groupInfo,
      msgList: state.getIn(['chat', 'converses', selectedUUID, 'msgList']).sortBy((item) => item.get('date')),
      userUUID: state.getIn(['user','info','uuid']),
      usercache: state.getIn(['cache', 'user']),
      selfGroupActors: groupInfo.get('group_actors', []).filter(i => i.get('enabled')&&selfActors.indexOf(i.get('actor_uuid'))>=0),
      selectedGroupActorUUID: groupInfo.getIn(['extra', 'selected_group_actor_uuid']),
    }
  }
)(GroupDetail);
