const React = require('react');
const { connect } = require('react-redux');
const Select = require('react-select');
const ReactTooltip = require('react-tooltip');
const { sendMsg } = require('../../../redux/actions/chat')
const GroupMap = require('./GroupMap');
const GroupInvite = require('./GroupInvite');
const GroupActor = require('./GroupActor');

class GroupDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputMsg: '',
      inputType: 'normal',
      isSlidePanelShow: false,
      slidePanelTitle: '',
      slidePanelContent: null,
      selectedActorUUID: 'uuiduuid',
    }
  }

  _handleSendMsg() {
    let message = this.state.inputMsg.trim();
    let type = this.state.inputType;
    // console.log(message, type);
    // return;

    if(!!message) {
      console.log('send msg:', message, 'to', this.props.selectedUUID);
      this.props.dispatch(sendMsg(this.props.selectedUUID ,{
        room: this.props.selectedUUID,
        message,
        is_public: true,
        type,
      }));
      this.refs.inputMsg.focus();
      this.setState({inputMsg: ''});
    }
  }

  _handleMsgInput(e) {
    if(e.keyCode===13 && !e.shiftKey) {
      this._handleSendMsg();
    }
  }

  _handleShowSlidePanel(title, content) {
    this.sildeEvent = function () {
      console.log('close slide panel with click');
      window.removeEventListener('click', this.sildeEvent);
      if(this.sildeEvent) {
        this.setState({isSlidePanelShow: false});
        this.sildeEvent = null;
      }
    }.bind(this);

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
    this.sildeEvent = null;
  }

  componentDidMount() {
    console.log('curGroupInfo', this.props.groupInfo?this.props.groupInfo.toJS():'None');
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
      },
      {
        name: '游戏地图',
        icon: '&#xe6d7;',
        component: (
          <GroupMap />
        )
      },
      {
        name: '游戏规则',
        icon: '&#xe621;',
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
      console.log(this.props.msgList.toJS());
      return (
        <div>
          {JSON.stringify(this.props.msgList.size)}
        </div>
      )
    }
  }

  render() {
    let inputType = this.state.inputType;
    let options = [
      { value: 'uuiduuid', label: '桐谷和人' },
      { value: 'uuiduuid2', label: '亚丝娜' }
    ];
    return (
      <div className="detail">
        <ReactTooltip effect='solid' />
        <div className="group-header">
          <div className="avatar">
            <img src="/src/assets/img/gugugu1.png" />
          </div>
          <div className="title">
            <div className="main-title">{this.props.groupInfo.get('name')}</div>
            <div className="sub-title">{this.props.groupInfo.get('desc')}</div>
          </div>
          <Select
            name="form-field-name"
            className="actor-select"
            value={this.state.selectedActorUUID}
            options={options}
            clearable={false}
            searchable={false}
            placeholder="请选择身份..."
            onChange={(item) => this.setState({selectedActorUUID: item.value})}
          />
          <div className="actions">
            {this.getHeaderActions()}
          </div>
        </div>
        <div className="group-content">{this.getMsgList()}</div>
        <div className="group-msg-box">
          <div className="input-area">
            <div className="tool-area">
              <div className="type-select">
                <div
                  data-tip="普通信息"
                  className={inputType==='normal'?"tool-item active":"tool-item"}
                  onClick={() => this.setState({inputType: 'normal'})}
                >
                  <i className="iconfont">&#xe72d;</i>
                </div>
                <div
                  data-tip="吐槽信息"
                  className={inputType==='occ'?"tool-item active":"tool-item"}
                  onClick={() => this.setState({inputType: 'occ'})}
                >
                  <i className="iconfont">&#xe64d;</i>
                </div>
                <div
                  data-tip="对话信息"
                  className={inputType==='speak'?"tool-item active":"tool-item"}
                  onClick={() => this.setState({inputType: 'speak'})}
                >
                  <i className="iconfont">&#xe61f;</i>
                </div>
                <div
                  data-tip="行动信息"
                  className={inputType==='action'?"tool-item active":"tool-item"}
                  onClick={() => this.setState({inputType: 'action'})}
                >
                  <i className="iconfont">&#xe619;</i>
                </div>
              </div>
              <div className="actions">
                <div
                  data-tip="请求投骰"
                  className="tool-item"
                  onClick={() => console.log('a')}
                >
                  <i className="iconfont">&#xe609;</i>
                </div>
                <div
                  data-tip="邀请投骰"
                  className="tool-item"
                  onClick={() => console.log('b')}
                >
                  <i className="iconfont">&#xe631;</i>
                </div>
              </div>
            </div>
            <textarea
              ref="inputMsg"
              className="input-msg"
              value={this.state.inputMsg}
              onChange={(e)=>this.setState({inputMsg:e.target.value})}
              onKeyUp={(e)=> this._handleMsgInput(e)} />
          </div>
          <div className="action-area">
            <button onClick={() => this._handleSendMsg()} disabled={this.state.inputMsg?false:true}>发送&lt;Enter&gt;</button>
          </div>
        </div>
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
          {this.state.slidePanelContent}
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => {
    let selectedUUID = state.getIn(['group', 'selectedGroupUUID'])
    return {
      selectedUUID,
      groupInfo: state
        .getIn(['group', 'groups'])
        .find((group) => group.get('uuid')===selectedUUID),
      msgList: state.getIn(['chat', 'converses', selectedUUID, 'msgList'])
    }
  }
)(GroupDetail);
