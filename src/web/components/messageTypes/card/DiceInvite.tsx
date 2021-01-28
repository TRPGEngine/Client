import BaseCard from './BaseCard';
import { connect, DispatchProp } from 'react-redux';
import { acceptDiceInvite } from '../../../../shared/redux/actions/dice';
import type { MessageProps } from '@shared/components/message/MessageHandler';
import type { TRPGState } from '@src/shared/redux/types/__all__';

interface Props extends MessageProps, DispatchProp<any> {
  selfUUID: string;
}

// 投骰邀请
class DiceInvite extends BaseCard<Props> {
  getCardBtn() {
    const info = this.props.info;
    const me = this.props.me;
    const data = info.data!;
    const uuid = info.uuid;
    const allow_accept_list = data.allow_accept_list;
    const is_accept_list = data.is_accept_list;
    // TODO: 需要服务端配合实现即时显示所有邀请完成(目前只能通过刷新后显示)

    if (allow_accept_list.length === is_accept_list.length) {
      return [{ label: '已完成' }];
    }

    if (is_accept_list.includes(this.props.selfUUID)) {
      // 已接受列表中有自己
      return [{ label: '已投掷' }];
    } else if (allow_accept_list.includes(this.props.selfUUID)) {
      // 允许列表中有自己且未投掷
      return [
        {
          label: '开始投掷',
          onClick: () => this.props.dispatch(acceptDiceInvite(uuid)),
        },
      ];
    } else {
      // 与我无关
      return [
        {
          label: me ? '等待对方处理' : '等待其他人处理',
        },
      ];
    }
  }
}

export default connect((state: TRPGState) => ({
  selfUUID: state.user.info.uuid!,
}))(DiceInvite);
