const React = require('react');
const Select = require('react-select');

require('./DiceRequest.scss');

class DiceRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diceType: 'basicDice',
      diceReason: '',
    }
  }

  _handleSendReq() {
    let diceExp = '';
    if(this.state.diceType === 'basicDice') {
      diceExp = this.refs.diceNum.value + 'd' + this.refs.diceFace.value;
    }else {
      diceExp = this.refs.diceExp.value;
    }

    console.log(`因为 ${this.state.diceReason} 请求投出: ${diceExp}`);
    this.props.onSendDiceRequest(this.state.diceReason, diceExp);
  }

  render() {
    let diceTypeOptions = [
      { value: 'basicDice', label: '基本骰' },
      { value: 'complexDice', label: '复合骰' }
    ]
    return (
      <div className="dice-request">
        <span>因为</span>
        <input
          type="text"
          className="dice-reason"
          placeholder="投骰理由"
          value={this.state.diceReason}
          onChange={(e) => this.setState({diceReason: e.target.value})}
        />
      <span>请求投骰<i className="iconfont">&#xe609;</i></span>
        <Select
          name="dice-select"
          className="dice-select"
          value={this.state.diceType}
          options={diceTypeOptions}
          clearable={false}
          searchable={false}
          placeholder="请选择骰子类型..."
          onChange={(item) => this.setState({diceType: item.value})}
        />
        {
          this.state.diceType === 'complexDice' ? (
            <div className="dice complexDice">
              <input key="dicereq-diceExp" type="text" placeholder="请输入骰子表达式" ref="diceExp" defaultValue="1d100" />
            </div>
          ) : (
            <div className="dice basicDice">
              <input key="dicereq-diceNum" type="number" placeholder="骰数" defaultValue="1" ref="diceNum" />
              <span>d</span>
              <input key="dicereq-diceFace" type="number" placeholder="骰面" defaultValue="100" ref="diceFace" />
            </div>
          )
        }
        <button onClick={() => this._handleSendReq()}>发送申请</button>
      </div>
    )
  }
}

module.exports = DiceRequest;
