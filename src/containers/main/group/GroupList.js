const React = require('react');
const { connect } = require('react-redux');
const ConvItem = require('../../../components/ConvItem');
const moment = require('moment');
const ReactTooltip = require('react-tooltip');

require('./GroupList.scss');

class GroupList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputMsg: '',
      inputType: 'normal',
      isSlidePanelShow: false,
      slidePanelTitle: '',
      slidePanelContent: null,
    }
  }

  _handleSelectGroup(uuid) {
    console.log(uuid);
  }

  _handleSendMsg() {
    let message = this.state.inputMsg.trim();
    let type = this.state.inputType;
    console.log(message, type);
    return;

    if(!!message) {
      console.log('send msg:', message, 'to', this.props.converseUUID);
      this.props.dispatch(sendMsg(this.props.converseUUID ,{
        message,
        is_public: false,
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
    let event = function () {
      console.log('close slide panel');
      this.setState({isSlidePanelShow: false});
      window.removeEventListener('click', event);
    }.bind(this);

    setTimeout(() => {
      window.addEventListener('click', event);
    }, 500);
    this.setState({
      isSlidePanelShow: true,
      slidePanelTitle: title,
      slidePanelContent: content,
    });
  }

  getHeaderActions() {
    let actions = [
      {
        name: '添加团员',
        icon: '&#xe61c;',
        component: (
          <div>
            aaaaa
          </div>
        )
      },
      {
        name: '查看团员',
        icon: '&#xe603;',
      },
      {
        name: '游戏地图',
        icon: '&#xe6d7;',
      },
      {
        name: '游戏规则',
        icon: '&#xe621;',
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
          onClick={() => {
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
    return (
      <div className="group">
        <div className="list">
          <ConvItem
            key={'converses#'+1}
            icon={'/src/assets/img/gugugu1.png'}
            title={'无限恐怖跑团1群'}
            content={'测试测试'}
            time={moment().format('YYYY-MM-DD HH:mm:ss')}
            uuid={'qweqwead'}
            isSelected={true}
            onClick={() => this._handleSelectGroup('qweqwead')}
          />
        </div>
        <div className="detail">
          <ReactTooltip effect='solid' />
          <div className="group-header">
            <div className="avatar">
              <img src="/src/assets/img/gugugu1.png" />
            </div>
            <div className="title">
              <div className="main-title">无限恐怖跑团1群</div>
              <div className="sub-title">可以开始车卡了</div>
            </div>
            <div className="actions">
              {this.getHeaderActions()}
            </div>
          </div>
          <div className="group-content"></div>
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
                onClick={() => this.setState({isSlidePanelShow: false})}
              >
                <i className="iconfont">&#xe70c;</i>
              </div>
            </div>
            {this.state.slidePanelContent}
          </div>
        </div>
      </div>
    )
  }
}

module.exports = connect()(GroupList);
