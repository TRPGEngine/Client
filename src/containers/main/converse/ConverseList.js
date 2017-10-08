const React = require('react');
const { connect } = require('react-redux');

const ConverseDetail = require('./ConverseDetail');
const ConvItem = require('../../../components/ConvItem');
const { switchConverse } = require('../../../redux/actions/chat');

require('./ConverseList.scss');

class ConverseList extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleSelectConverse(uuid) {
    console.log("选择会话", uuid);
    this.props.dispatch(switchConverse(uuid));
  }

  getWelcomeMessage() {
    let hours = new Date().getHours();
    if(hours < 6) {
      return "我欲修仙，法力无边。"
    }else if(hours < 12) {
      return "早上好，今天请继续加油！"
    }else if(hours < 18) {
      return "下午好，喝杯茶吧，让精神抖擞起来。"
    }else {
      return "跑团时间到！赶紧找个团一起哈啤！"
    }
  }

  getConverseList() {
    let converses = this.props.converses.toArray().map((item, index) => {
      item = item.toJS();
      return (
        <ConvItem
          key={'converses#'+index}
          icon={item.icon || '/src/assets/img/gugugu1.png'}
          title={item.name}
          content={item.lastMsg}
          time={item.lastTime}
          uuid={item.uuid}
          isSelected={this.props.selectedUUID === item.uuid}
          onClick={() => this._handleSelectConverse(item.uuid)}
        />
      )
    });
    return converses;
  }

  getSystemConverse() {
    let uuid = "trpgsystem";
    return (
      <ConvItem
        key={'converses#system'}
        icon='/src/assets/img/system_notice.png'
        title='系统消息'
        content={''}
        time={''}
        uuid={uuid}
        isSelected={this.props.selectedUUID === uuid}
        onClick={() => this._handleSelectConverse(uuid)}
      />
    )
  }

  render() {
    return (
      <div className="converse">
        <div className="list">
          {this.getSystemConverse()}
          {this.getConverseList()}
        </div>
        <div className="detail">
          {
            this.props.selectedUUID
            ? (
              <ConverseDetail converseUUID={this.props.selectedUUID} list={this.props.converses.getIn([this.props.selectedUUID, 'msgList'])}/>
            )
            : (
              <div className="nocontent">
                <p className="nocontent-img"><img src="/src/assets/img/dice.png" /></p>
                <p className="welcome">{this.getWelcomeMessage()}</p>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    selectedUUID: state.getIn(['chat', 'selectedConversesUUID']),
    converses: state.getIn(['chat', 'converses']),
  })
)(ConverseList);
