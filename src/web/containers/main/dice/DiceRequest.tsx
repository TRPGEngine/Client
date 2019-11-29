import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { setLastDiceType } from '../../../../shared/redux/actions/ui';

import './DiceRequest.scss';
import { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';

interface Props extends TRPGDispatchProp {
  lastDiceType: string;
  favoriteDice: any;

  onSendDiceRequest: (reason: string, exp: string) => void;
}
class DiceRequest extends React.Component<Props> {
  state = {
    diceType: this.props.lastDiceType || 'basicDice',
    diceReason: '',
    favoriteDiceValue: '',

    diceNum: '1',
    diceFace: '100',
    diceExp: '1d100',
    diceTempAdd: '0',
  };

  handleSendReq() {
    let diceExp = '';
    if (this.state.diceType === 'basicDice') {
      diceExp = this.state.diceNum + 'd' + this.state.diceFace;
    } else if (this.state.diceType === 'complexDice') {
      diceExp = this.state.diceExp;
    } else if (this.state.diceType === 'favoriteDice') {
      diceExp =
        this.state.favoriteDiceValue + '+' + (this.state.diceTempAdd || 0);
    }

    console.log(`因为 ${this.state.diceReason} 请求投出: ${diceExp}`);
    if (this.props.onSendDiceRequest) {
      this.props.onSendDiceRequest(this.state.diceReason, diceExp);
    }
  }
  handleChangeDiceType(type) {
    this.setState({ diceType: type });
    this.props.dispatch(setLastDiceType(type));
  }

  render() {
    const { diceNum, diceFace, diceExp, diceTempAdd } = this.state;
    let diceTypeOptions = [
      { value: 'basicDice', label: '基本骰' },
      { value: 'complexDice', label: '复合骰' },
      { value: 'favoriteDice', label: '常用骰' },
    ];
    let favoriteDice = this.props.favoriteDice
      .map((i) => ({
        value: i.get('value'),
        label: `${i.get('title')}(${i.get('value')})`,
      }))
      .toJS();
    return (
      <div className="dice-request">
        <span>因为</span>
        <input
          type="text"
          className="dice-reason"
          placeholder="投骰理由"
          value={this.state.diceReason}
          onChange={(e) => this.setState({ diceReason: e.target.value })}
        />
        <span>
          请求投骰<i className="iconfont">&#xe609;</i>
        </span>
        <Select
          name="dice-select"
          className="dice-select"
          value={this.state.diceType}
          options={diceTypeOptions}
          clearable={false}
          searchable={false}
          placeholder="请选择骰子类型..."
          onChange={(item) => this.handleChangeDiceType(item.value)}
        />
        {this.state.diceType === 'basicDice' ? (
          <div className="dice basicDice">
            <input
              key="dicereq-diceNum"
              type="number"
              placeholder="骰数"
              value={diceNum}
              onChange={(e) =>
                this.setState({
                  diceNum: e.target.value,
                })
              }
            />
            <span>d</span>
            <input
              key="dicereq-diceFace"
              type="number"
              placeholder="骰面"
              value={diceFace}
              onChange={(e) =>
                this.setState({
                  diceFace: e.target.value,
                })
              }
            />
          </div>
        ) : this.state.diceType === 'complexDice' ? (
          <div className="dice complexDice">
            <input
              key="dicereq-diceExp"
              type="text"
              placeholder="请输入骰子表达式"
              value={diceExp}
              onChange={(e) =>
                this.setState({
                  diceExp: e.target.value,
                })
              }
            />
          </div>
        ) : (
          <div className="dice favoriteDice">
            <Select
              name="dice-favorite-select"
              className="dice-favorite-select"
              value={this.state.favoriteDiceValue}
              options={favoriteDice}
              clearable={false}
              searchable={false}
              placeholder="请选择常用骰"
              onChange={(item) =>
                this.setState({ favoriteDiceValue: item.value })
              }
            />
            <input
              key="dicereq-diceTempAdd"
              type="number"
              placeholder="临时加值"
              value={diceTempAdd}
              onChange={(e) =>
                this.setState({
                  diceTempAdd: e.target.value,
                })
              }
            />
          </div>
        )}
        <button onClick={() => this.handleSendReq()}>发送申请</button>
      </div>
    );
  }
}

export default connect((state: TRPGState) => ({
  lastDiceType: state.getIn(['ui', 'lastDiceType']),
  favoriteDice: state.getIn(['settings', 'user', 'favoriteDice']),
}))(DiceRequest);
