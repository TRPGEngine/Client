const React = require('react');
const PropTypes = require('prop-types');
const { connect } = require('react-redux');
const ReactTooltip = require('react-tooltip');
const Emoticon = require('./Emoticon');
const pasteUtils = require('../../utils/pasteUtils');
const { sendMsg } = require('../../redux/actions/chat');
const { showModal, hideModal } = require('../../redux/actions/ui');
const ActorSelect = require('./modal/ActorSelect');

require('./MsgSendBox.scss');

class MsgSendBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputMsg: '',
      inputType: 'normal',
      showEmoticon: false,
      showDiceMethods: false,
    };
    this.clickableBtn = [
      {
        label: '发送表情',
        icon: '&#xe683;',
        onClick: (e) => {e.stopPropagation();this._handleShowEmoticon();},
      },
      {
        label: '发送人物卡',
        icon: '&#xe61b;',
        onClick: (e) => this._handleShowSendActor(),
      },
    ];
    this.inputType = [
      {
        label: '普通信息',
        type: 'normal',
        icon: '&#xe72d;',
      },
      {
        label: '吐槽信息',
        type: 'ooc',
        icon: '&#xe64d;',
      },
      {
        label: '对话信息',
        type: 'speak',
        icon: '&#xe61f;',
      },
      {
        label: '行动信息',
        type: 'action',
        icon: '&#xe619;',
      },
    ];
    this.actions = [
      {
        label: '',
        icon: '&#xe631;',
        onClick: () => this._handleShowDiceMethods(),
      },
    ];
    if(this.props.onQuickDice) {
      this.actions.unshift({
        label: '快速投骰',
        icon: '&#xe609;',
        onClick: () => this.props.onQuickDice(),
      })
    }
    this.hidePopup = () => {
      window.removeEventListener('click', this.hidePopup);
      this.setState({
        showEmoticon: false,
        showDiceMethods: false,
      });
    }
  }

  componentDidMount() {
    this.refs.inputMsg.focus();
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.hidePopup);
  }

  _handleMsgInputKeyDown(e) {
    if(e.keyCode===9) {
      e.preventDefault();
      let index = this.inputType.findIndex((item) => item.type===this.state.inputType);
      if(!e.shiftKey) {
        // 正向
        let i = (index + 1) % this.inputType.length;
        this.setState({inputType: this.inputType[i].type});
      }else {
        // 反向
        let i = (index + this.inputType.length - 1) % this.inputType.length;
        this.setState({inputType: this.inputType[i].type});
      }
    }

    if(e.keyCode===13 && !e.shiftKey) {
      // 发送信息
      e.preventDefault();
    }
  }

  _handleMsgInputKeyUp(e) {
    if(e.keyCode===13 && !e.shiftKey) {
      this._handleSendMsg();
    }
  }

  async _handlePaste(e) {
    if(e.clipboardData && e.clipboardData.items) {
      let image = pasteUtils.isPasteImage(e.clipboardData.items);
      if(image) {
        // 上传图片
        e.preventDefault();
        let file = image.getAsFile();
        let data = await pasteUtils.upload(this.props.userUUID, file);
        if(data && data.chatimg) {
          console.log(data);
          this.setState({inputMsg: this.state.inputMsg + `[img]${data.chatimg.url}[/img]`});
        }
      }
    }
  }

  _handleSendMsg() {
    let message = this.state.inputMsg.trim();
    let type = this.state.inputType;
    if(!!message) {
      this.props.onSendMsg(message, type);
      this.refs.inputMsg.focus();
      this.setState({inputMsg: ''});
    }
  }

  // 显示选择表情弹出框
  _handleShowEmoticon() {
    this.setState({showEmoticon: !this.state.showEmoticon});
    setTimeout(() => window.addEventListener('click', this.hidePopup), 0);
  }

  _handleSelectEmoticon(code) {
    this.setState({inputMsg: this.state.inputMsg + code});
    this.hidePopup();
    this.refs.inputMsg.focus();
  }

  // 显示投骰方式弹出框
  _handleShowDiceMethods() {
    this.setState({showDiceMethods: !this.state.showDiceMethods});
    setTimeout(() => window.addEventListener('click', this.hidePopup), 0);
  }

  // 发送人物卡
  _handleShowSendActor() {
    console.log('发送人物卡');
    this.props.dispatch(showModal(
      <ActorSelect
        onSelect={(actorUUID, actorInfo) => {
          this.props.dispatch(hideModal());
          console.log('人物卡信息', actorUUID, actorInfo);
          let {converseUUID, isGroup} = this.props;
          this.props.dispatch(sendMsg(converseUUID, {
            room: isGroup ? converseUUID : '',
            type: 'card',
            message: '[人物卡]',
            is_public: isGroup,
            data: {
              type: 'actor',
              uuid: actorUUID,
              avatar: actorInfo.avatar,
              name: actorInfo.name,
              desc: actorInfo.desc,
            }
          }))
        }}
      />
    ))
  }

  render() {
    return (
      <div className="send-msg-box">
        <div className="input-area">
          <div className="tool-area">
            <div className={'popup emoticon' + (this.state.showEmoticon ? ' active':'')}>
              <Emoticon onSelect={(code) => this._handleSelectEmoticon(code)}/>
            </div>
            <div className={'popup dice' + (this.state.showDiceMethods ? ' active':'')}>
              <ul>
                <li onClick={() => this.props.onSendDiceReq && this.props.onSendDiceReq()}>请求投骰</li>
                <li onClick={() => this.props.onSendDiceInv && this.props.onSendDiceInv()}>邀请投骰</li>
              </ul>
            </div>
            <ReactTooltip effect="solid" />
            <div className="btn-group">
              {this.clickableBtn.map((item, index) => {
                return (
                  <div
                    key={'btn-group#'+index}
                    data-tip={item.label}
                    className="tool-item"
                    onClick={(e) => !!item.onClick && item.onClick(e)}
                  >
                    <i className="iconfont" dangerouslySetInnerHTML={{__html:item.icon}}></i>
                  </div>
                )
              })}
            </div>
            <div className="type-select">
              {this.inputType.map((item, index) => {
                return (
                  <div
                    key={'input-type#'+index}
                    data-tip={item.label}
                    className={this.state.inputType===item.type?'tool-item active':'tool-item'}
                    onClick={() => this.setState({inputType: item.type})}
                  >
                    <i className="iconfont" dangerouslySetInnerHTML={{__html:item.icon}}></i>
                  </div>
                )
              })}
            </div>
            <div className="input-actions">
              {this.actions.map((item, index) => {
                return (
                  <div
                    key={'input-action#'+index}
                    data-tip={item.label}
                    className="tool-item"
                    onClick={() => item.onClick ? item.onClick() : ''}
                  >
                    <i className="iconfont" dangerouslySetInnerHTML={{__html:item.icon}}></i>
                  </div>
                )
              })}
            </div>
          </div>
          <textarea
            ref="inputMsg"
            className="input-msg"
            value={this.state.inputMsg}
            onChange={(e)=>this.setState({inputMsg:e.target.value})}
            onKeyDown={(e)=> this._handleMsgInputKeyDown(e)}
            onKeyUp={(e)=> this._handleMsgInputKeyUp(e)}
            onPaste={(e)=> this._handlePaste(e)}
          />
        </div>
        <div className="action-area">
          <button onClick={() => this._handleSendMsg()} disabled={this.state.inputMsg?false:true}>发送&lt;Enter&gt;</button>
        </div>
      </div>
    )
  }
}

MsgSendBox.propTypes = {
  conversesUUID: PropTypes.string,
  isRoom: PropTypes.bool,
}

module.exports = connect(
  state => ({
    userUUID: state.getIn(['user', 'info', 'uuid'])
  })
)(MsgSendBox);
