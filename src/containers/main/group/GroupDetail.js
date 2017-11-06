const React = require('react');
const { connect } = require('react-redux');
const config = require('../../../../config/project.config.js');
const dateHelper = require('../../../utils/dateHelper');
const Select = require('react-select');
const ReactTooltip = require('react-tooltip');
const { showModal } = require('../../../redux/actions/ui');
const { sendMsg } = require('../../../redux/actions/chat');
const { changeSelectGroupActor } = require('../../../redux/actions/group');
const MsgSendBox = require('../../../components/MsgSendBox');
const MsgItem = require('../../../components/MsgItem');
const Webview = require('../../../components/Webview');
const scrollTo = require('../../../utils/animatedScrollTo.js');
const GroupMap = require('./GroupMap');
const GroupInvite = require('./GroupInvite');
const GroupActor = require('./GroupActor');
const GroupMember = require('./GroupMember');
const GroupInfo = require('./GroupInfo');
const DiceRequest = require('../dice/DiceRequest');
const IsDeveloping = require('../../../components/IsDeveloping');

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

  componentDidMount() {
    let container = this.refs.container;
    scrollTo.bottom(container, 400);
    console.log('curGroupInfo', this.props.groupInfo?this.props.groupInfo.toJS():'None');
  }

  componentDidUpdate() {
    let container = this.refs.container;
    scrollTo.bottom(container, 400, false);
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

  _handleSendDiceReq() {
    this.props.dispatch(showModal(
      <DiceRequest />
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
          <Webview src="http://www.goddessfantasy.net/" />
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

  getMsgList() {
    if(!this.props.msgList) {
      return null;
    }else {
      let userUUID = this.props.userUUID;
      let usercache = this.props.usercache;
      return (
        <div className="msg-items">
        {
          this.props.msgList.sortBy((item) => item.get('date')).map((item, index) => {
            let defaultAvatar = item.get('sender_uuid') === 'trpgsystem' ? config.defaultImg.trpgsystem : config.defaultImg.group;
            let data = item.get('data');

            // data 预处理
            if(data && item.get('type') === 'card') {
              if(data.get('type') === 'friendInvite') {
                let inviteUUID = data.getIn(['invite', 'uuid']);
                let from_uuid = data.getIn(['invite', 'from_uuid']);
                let inviteIndex = this.props.friendRequests.findIndex((item) => {
                  if(item.get('uuid') === inviteUUID) {
                    return true
                  }else {
                    return false
                  }
                });
                if(inviteIndex >= 0) {
                  // 尚未处理
                  data = data.set('actionState', 0);
                }else {
                  let friendIndex = this.props.friendList.indexOf(from_uuid);
                  if(friendIndex >= 0) {
                    // 已同意是好友
                    data = data.set('actionState', 1);
                  }else {
                    // 已拒绝好友邀请
                    data = data.set('actionState', 2);
                  }

                }
              }
            }

            return (
              <MsgItem
                key={item.get('uuid')+'+'+index}
                icon={usercache.getIn([item.sender_uuid, 'avatar']) || defaultAvatar}
                name={usercache.getIn([item.sender_uuid, 'username']) || ''}
                type={item.get('type')}
                content={item.get('message')}
                data={data}
                time={dateHelper.getMsgDate(item.get('date'))}
                me={userUUID===item.get('sender_uuid')}
              />
            )
          })
        }
        </div>
      )
    }
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
            <div className="sub-title">{this.props.groupInfo.get('desc')}</div>
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
        <div className="group-content" ref="container">
          {this.getMsgList()}
        </div>
        <MsgSendBox
          onSendMsg={(message, type) => this._handleSendMsg(message, type)}
          onSendDiceReq={() => this._handleSendDiceReq()}
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
      msgList: state.getIn(['chat', 'converses', selectedUUID, 'msgList']),
      userUUID: state.getIn(['user','info','uuid']),
      usercache: state.getIn(['cache', 'user']),
      selfGroupActors: groupInfo.get('group_actors').filter(i => i.get('enabled')&&selfActors.indexOf(i.get('actor_uuid'))>=0),
      selectedGroupActorUUID: groupInfo.getIn(['extra', 'selected_group_actor_uuid']),
    }
  }
)(GroupDetail);
