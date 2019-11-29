import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { setLastDiceType } from '../../../../shared/redux/actions/ui';

import './DiceInvite.scss';
import { TRPGDispatchProp, TRPGState } from '@redux/types/__all__';

interface Props extends TRPGDispatchProp {
  lastDiceType: string;
  inviteList: any;

  onSendDiceInvite: (reason: string, exp: string) => void;
}

class DiceInvite extends React.Component<Props> {
  state = {
    diceType: this.props.lastDiceType || 'basicDice',
    diceReason: '',

    diceNum: '1',
    diceFace: '100',
    diceExp: '1d100',
  };

  handleSendReq() {
    let diceExp = '';
    if (this.state.diceType === 'basicDice') {
      diceExp = this.state.diceNum + 'd' + this.state.diceFace;
    } else {
      diceExp = this.state.diceExp;
    }

    // console.log(`因为 ${this.state.diceReason} 请求投出: ${diceExp}`);
    if (this.props.onSendDiceInvite) {
      this.props.onSendDiceInvite(this.state.diceReason, diceExp);
    }
  }

  handleChangeDiceType(type) {
    this.setState({ diceType: type });
    this.props.dispatch(setLastDiceType(type));
  }

  render() {
    const { diceNum, diceFace, diceExp } = this.state;

    const diceTypeOptions = [
      { value: 'basicDice', label: '基本骰' },
      { value: 'complexDice', label: '复合骰' },
    ];
    return (
      <div className="dice-invite">
        <span>因为</span>
        <input
          type="text"
          className="dice-reason"
          placeholder="投骰理由"
          value={this.state.diceReason}
          onChange={(e) => this.setState({ diceReason: e.target.value })}
        />
        <span>
          邀请
          {this.props.inviteList ? this.props.inviteList.join(',') : '所有人'}
          投骰<i className="iconfont">&#xe609;</i>
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
        {this.state.diceType === 'complexDice' ? (
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
        )}
        <button onClick={() => this.handleSendReq()}>发送申请</button>
      </div>
    );
  }
}

export default connect((state: TRPGState) => ({
  lastDiceType: state.getIn(['ui', 'lastDiceType']),
}))(DiceInvite);
