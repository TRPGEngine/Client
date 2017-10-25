const React = require('react');
const ReactTooltip = require('react-tooltip');

require('./MsgSendBox.scss');

class MsgSendBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputMsg: '',
      inputType: 'normal'
    };
    this.inputType = [
      {
        label: '普通信息',
        type: 'normal',
        icon: '&#xe72d;'
      },
      {
        label: '吐槽信息',
        type: 'occ',
        icon: '&#xe64d;'
      },
      {
        label: '对话信息',
        type: 'speak',
        icon: '&#xe61f;'
      },
      {
        label: '行动信息',
        type: 'action',
        icon: '&#xe619;'
      },
    ]
    this.actions = [
      {
        label: '请求投骰',
        type: 'dice-req',
        icon: '&#xe609;',
        onClick: this.props.onSendDiceReq,
      },
      {
        label: '邀请投骰',
        type: 'dice-inv',
        icon: '&#xe631;',
        onClick: this.props.onSendDiceInv,
      },
    ]
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
  }

  _handleMsgInputKeyUp(e) {
    if(e.keyCode===13 && !e.shiftKey) {
      this._handleSendMsg();
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

  render() {
    return (
      <div className="send-msg-box">
        <div className="input-area">
          <div className="tool-area">
            <ReactTooltip effect='solid' />
            <div className="type-select">
              {this.inputType.map((item, index) => {
                return (
                  <div
                    key={"input-type#"+index}
                    data-tip={item.label}
                    className={this.state.inputType===item.type?"tool-item active":"tool-item"}
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
                    key={"input-action#"+index}
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
            onKeyUp={(e)=> this._handleMsgInputKeyUp(e)} />
        </div>
        <div className="action-area">
          <button onClick={() => this._handleSendMsg()} disabled={this.state.inputMsg?false:true}>发送&lt;Enter&gt;</button>
        </div>
      </div>
    )
  }
}

module.exports = MsgSendBox;
