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
  }

  _handleMsgInput(e) {
    if(e.keyCode===13 && !e.shiftKey) {
      this._handleSendMsg();
    }

    if(e.keyCode===9) {
      e.preventDefault();
      console.log("tab");
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
          <textarea
            ref="inputMsg"
            className="input-msg"
            value={this.state.inputMsg}
            onChange={(e)=>this.setState({inputMsg:e.target.value})}
            onKeyDown={(e)=> this._handleMsgInput(e)} />
        </div>
        <div className="action-area">
          <button onClick={() => this._handleSendMsg()} disabled={this.state.inputMsg?false:true}>发送&lt;Enter&gt;</button>
        </div>
      </div>
    )
  }
}

module.exports = MsgSendBox;
