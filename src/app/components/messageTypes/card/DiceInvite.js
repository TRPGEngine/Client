const BaseCard = require('./BaseCard');
const { connect } = require('react-redux');
const { acceptDiceInvite } = require('../../../../redux/actions/dice');

// 投骰邀请
class DiceInvite extends BaseCard {
  getCardBtn() {
    let info = this.props.info;
    let me = this.props.me;
    let data = info.data;
    let uuid = info.uuid;
    let allow_accept_list = data.allow_accept_list;
    let is_accept_list = data.is_accept_list;
    // TODO: 需要服务端配合实现即时显示所有邀请完成(目前只能通过刷新后显示)

    if(allow_accept_list.length === is_accept_list.length) {
      return [{label: '已完成'}]
    }

    if(is_accept_list.includes(this.props.selfUUID)) {
      // 已接受列表中有自己
      return [{label: '已投掷'}]
    } else if(allow_accept_list.includes(this.props.selfUUID)) {
      // 允许列表中有自己且未投掷
      return [{
        label: '开始投掷',
        onClick: () => this.props.dispatch(acceptDiceInvite(uuid)),
      }]
    } else {
      // 与我无关
      return [{
        label: me ? '等待对方处理' : '等待其他人处理'
      }]
    }
  }
}

module.exports = connect(
  state => ({
    selfUUID: state.getIn(['user', 'info', 'uuid']),
  })
)(DiceInvite);
