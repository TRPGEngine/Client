const React = require('react');
const { connect } = require('react-redux');

const ConverseDetail = require('./ConverseDetail');
const ConvItem = require('../../components/ConvItem');
const chat = require('../../redux/actions/chat');

require('./ConverseList.scss');

class ConverseList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUUID: ''
    };
  }

  _handleSelectConverse(uuid) {
    console.log("选择会话", uuid);
    this.setState({
      selectedUUID: uuid
    })
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
          isSelected={this.state.selectedUUID === item.uuid}
          onClick={() => this._handleSelectConverse(item.uuid)}
        />
      )
    });
    return converses;
  }

  render() {
    return (
      <div className="converse">
        <div className="list">
          {this.getConverseList()}
        </div>
        <div className="detail">
          {
            this.state.selectedUUID
            ? (
              <ConverseDetail converseUUID={this.state.selectedUUID} list={this.props.converses.getIn([this.state.selectedUUID, 'msgList'])}/>
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
    converses: state.getIn(['chat', 'converses'])
  })
)(ConverseList);
