import React from 'react';
import { connect } from 'react-redux';
import { setLastDiceType } from '@shared/redux/actions/ui';
import { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';
import _get from 'lodash/get';

import './DiceRequest.scss';
import { Select } from 'antd';

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
    const diceTypeOptions = [
      { value: 'basicDice', label: '基本骰' },
      { value: 'complexDice', label: '复合骰' },
      { value: 'favoriteDice', label: '常用骰' },
    ];
    const favoriteDice = this.props.favoriteDice.map((i) => ({
      value: i.value,
      label: `${i.title}(${i.value})`,
    }));
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
          style={{ width: '100%' }}
          value={this.state.diceType}
          allowClear={false}
          placeholder="请选择骰子类型..."
          onChange={(value) => this.handleChangeDiceType(value)}
        >
          <Select.Option value="basicDice">基本骰</Select.Option>
          <Select.Option value="complexDice">复合骰</Select.Option>
          <Select.Option value="favoriteDice">常用骰</Select.Option>
        </Select>
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
              style={{ width: 200 }}
              value={this.state.favoriteDiceValue}
              allowClear={false}
              placeholder="请选择常用骰"
              onChange={(value) => this.setState({ favoriteDiceValue: value })}
            >
              {this.props.favoriteDice.map((i) => (
                <Select.Option key={i.value} value={i.value}>
                  {i.title}({i.value})
                </Select.Option>
              ))}
            </Select>
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
  lastDiceType: state.ui.lastDiceType,
  favoriteDice: _get(state, ['settings', 'user', 'favoriteDice']),
}))(DiceRequest);
