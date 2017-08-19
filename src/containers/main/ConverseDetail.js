const React = require('react');
const { connect } = require('react-redux');
const MsgItem = require('../../components/MsgItem');
const scrollTo = require('../../utils/animatedScrollTo.js');

require('./ConverseDetail.scss');

class ConverseDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputMsg: ''
    };
  }

  componentDidMount() {
    let container = this.refs.container;
    scrollTo.bottom(container, 400);
  }

  _handleSendMsg() {
    let msg = this.state.inputMsg;
    console.log('send msg:', msg);
    this.refs.inputMsg.focus();
    this.setState({inputMsg: ''});
  }

  getMsgList(list) {
    if(!!list) {
      return (
        <div className="msg-items">
        {
          list.map((item, index) => {
            return (
              <MsgItem
                key={item.uuid}
                icon={item.icon}
                name={item.sender}
                content={item.content}
                time={item.time}
                me={false}
              />
            )
          })
        }
        </div>
      )
    }else {
      return (
        <div className="msg-items">
          <MsgItem
            icon="http://img4.imgtn.bdimg.com/it/u=1627316970,161287288&fm=26&gp=0.jpg"
            name="admin"
            content="咕咕咕？"
            time="2017-08-17 13:48:46"
          />
          <MsgItem
            icon="http://img4.imgtn.bdimg.com/it/u=1627316970,161287288&fm=26&gp=0.jpg"
            name="admin"
            content="咕咕咕？"
            time="2017-08-17 13:48:46"
            me={true}
          />
          <MsgItem
            icon="http://img4.imgtn.bdimg.com/it/u=1627316970,161287288&fm=26&gp=0.jpg"
            name="admin"
            content="咕咕！咕咕咕咕咕咕咕咕咕咕咕咕咕咕!!咕咕咕咕!咕咕咕咕咕咕咕咕咕咕咕咕咕咕咕咕咕咕咕咕咕咕咕咕"
            time="2017-08-17 13:48:46"
            me={false}
          />
          <MsgItem
            icon="http://img4.imgtn.bdimg.com/it/u=1627316970,161287288&fm=26&gp=0.jpg"
            name="admin"
            content="咕咕~咕咕咕？"
            time="2017-08-17 13:48:46"
            me={false}
          />
          <MsgItem
            icon="http://img4.imgtn.bdimg.com/it/u=1627316970,161287288&fm=26&gp=0.jpg"
            name="admin"
            content="咕咕咕！"
            time="2017-08-17 13:48:46"
            me={true}
          />
          <MsgItem
            icon="http://img4.imgtn.bdimg.com/it/u=1627316970,161287288&fm=26&gp=0.jpg"
            name="admin"
            content="咕！！！！"
            time="2017-08-17 13:48:46"
            me={true}
          />
        </div>
      )
    }
  }

  render() {
    let list = this.props.list;
    if(!!list) {
      list = list.toJS();
    }
    return (
      <div className="conv-detail">
        <div className="conv-container" ref="container">
          {this.getMsgList(list)}
        </div>
        <div className="send-msg-box">
          <div className="input-area">
            <textarea
              ref="inputMsg"
              className="input-msg"
              value={this.state.inputMsg}
              onChange={(e)=>this.setState({inputMsg:e.target.value})} />
          </div>
          <div className="action-area">
            <button onClick={() => this._handleSendMsg()} disabled={this.state.inputMsg?false:true}>发送</button>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = connect()(ConverseDetail);
