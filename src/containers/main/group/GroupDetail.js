const React = require('react');
const { connect } = require('react-redux');
const config = require('../../../../config/project.config.js');
const dateHelper = require('../../../utils/dateHelper');
const Select = require('react-select');
const ReactTooltip = require('react-tooltip');
const { showModal, hideModal, showAlert } = require('../../../redux/actions/ui');
const { sendMsg, getMoreChatLog } = require('../../../redux/actions/chat');
const { changeSelectGroupActor } = require('../../../redux/actions/group');
const { sendDiceRequest, sendDiceInvite } = require('../../../redux/actions/dice');
const MsgSendBox = require('../../../components/MsgSendBox');
const MsgItem = require('../../../components/MsgItem');
const scrollTo = require('../../../utils/animatedScrollTo.js');
const GroupMap = require('./GroupMap');
const GroupInvite = require('./GroupInvite');
const GroupActor = require('./GroupActor');
const GroupMember = require('./GroupMember');
const GroupInfo = require('./GroupInfo');
const DiceRequest = require('../dice/DiceRequest');
const DiceInvite = require('../dice/DiceInvite');
const ListSelect = require('../../../components/ListSelect');
const IsDeveloping = require('../../../components/IsDeveloping');
const MsgContainer = require('../../../components/MsgContainer');

class GroupDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSlidePanelShow: false,
      slidePanelTitle: '',
      slidePanelContent: null,
    }
    this.sildeEvent = () => {
      console.log('close slide panel with click');
      window.removeEventListener('click', this.sildeEvent);
      this.setState({isSlidePanelShow: false});
    };
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.sildeEvent);
  }

  _handleShowSlidePanel(title, content) {
    setTimeout(() => {
      window.addEventListener('click', this.sildeEvent);
    }, 500);
    this.setState({
      isSlidePanelShow: true,
      slidePanelTitle: title,
      slidePanelContent: content,
    });
  }

  _handleHideSlidePanel() {
    console.log('close slide panel with btn');
    this.setState({isSlidePanelShow: false});
    window.removeEventListener('click', this.sildeEvent);
  }

  _handleSelectGroupActor(item) {
    if(item.value !== this.props.selectedGroupActorUUID) {
      this.props.dispatch(changeSelectGroupActor(this.props.selectedUUID, item.value));
    }
  }

  _handleSendMsg(message, type) {
    console.log('send msg:', message, 'to', this.props.selectedUUID);
    this.props.dispatch(sendMsg(this.props.selectedUUID ,{
      room: this.props.selectedUUID,
      message,
      is_public: true,
      type,
    }));
  }

  _handleSendDiceInv() {
    let usercache = this.props.usercache;
    let groupMembers = this.props.groupInfo.get('group_members');
    let list = groupMembers.map((i) => ({
      name: usercache.getIn([i, 'nickname']) || usercache.getIn([i, 'username']),
      uuid: usercache.getIn([i, 'uuid']),
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
                // TODO
                console.log(inviteUUIDList);
                console.log("diceReason, diceExp",diceReason, diceExp);
                let selectedUUID = this.props.selectedUUID;
                this.props.dispatch(sendDiceInvite(selectedUUID, true, diceExp, diceReason, inviteUUIDList, inviteNameList));
                this.props.dispatch(hideModal());
                // let selectedUUID = this.props.selectedUUID;
                // this.props.dispatch(sendDiceRequest(selectedUUID, true, diceExp, diceReason));
                // this.props.dispatch(hideModal());
              }}
            />
          ))
        }}
      />
    ))
  }

  getHeaderActions() {
    let actions = [
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
          key={"group-action-"+index}
          data-tip={item.name}
          onClick={(e) => {
            e.stopPropagation();
            this._handleShowSlidePanel(item.name, item.component)
          }}
        >
          <i className="iconfont" dangerouslySetInnerHTML={{__html: item.icon}}></i>
        </button>
      )
    })
  }

  render() {
    let inputType = this.state.inputType;
    let { selfGroupActors } = this.props;
    let options = [];
    if(selfGroupActors && selfGroupActors.size > 0) {
      options = selfGroupActors.map((item, index) => ({
        value: item.get('uuid'),
        label: item.getIn(['actor', 'name']),
      })).toJS();
    }
    return (
      <div className="detail">
        <ReactTooltip effect='solid' />
        <div className="group-header">
          <div className="avatar">
            <img src={this.props.groupInfo.get('avatar') || config.defaultImg.group} />
          </div>
          <div className="title">
            <div className="main-title">{this.props.groupInfo.get('name')}</div>
            <div className="sub-title">{this.props.groupInfo.get('sub-name')}</div>
          </div>
          <Select
            name="actor-select"
            className="actor-select"
            value={this.props.selectedGroupActorUUID}
            options={options}
            clearable={false}
            searchable={false}
            placeholder="请选择身份卡"
            onChange={(item) => this._handleSelectGroupActor(item)}
          />
          <div className="actions">
            {this.getHeaderActions()}
          </div>
        </div>
        <MsgContainer className="group-content" converseUUID={this.props.selectedUUID} />
        <MsgSendBox
          conversesUUID={this.props.selectedUUID}
          isGroup={true}
          onSendMsg={(message, type) => this._handleSendMsg(message, type)}
          onSendDiceInv={() => this._handleSendDiceInv()}
        />
        <div
          className={"group-slide-panel" + (this.state.isSlidePanelShow?"":" hide")}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="header">
            <div className="title">{this.state.slidePanelTitle}</div>
            <div
              className="close"
              onClick={() => this._handleHideSlidePanel()}
            >
              <i className="iconfont">&#xe70c;</i>
            </div>
          </div>
          <div className="content">
            {this.state.slidePanelContent}
          </div>
        </div>
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
      selfGroupActors: groupInfo.get('group_actors').filter(i => i.get('enabled')&&selfActors.indexOf(i.get('actor_uuid'))>=0),
      selectedGroupActorUUID: groupInfo.getIn(['extra', 'selected_group_actor_uuid']),
    }
  }
)(GroupDetail);
