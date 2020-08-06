import BaseCard from './BaseCard';
import { connect, DispatchProp } from 'react-redux';
import { acceptDiceRequest } from '../../../../shared/redux/actions/dice';
import { MessageProps } from '@shared/components/message/MessageHandler';
import { TRPGState } from '@src/shared/redux/types/__all__';

interface Props extends MessageProps, DispatchProp<any> {
  selfUUID: string;
}

// 投骰请求
class DiceRequest extends BaseCard<Props> {
  getCardBtn() {
    const info = this.props.info;
    const data = info.data!;
    const uuid = info.uuid;
    const is_accept = data.is_accept;
    const allow_accept_list = data.allow_accept_list;

    if (is_accept) {
      return [
        {
          label: '已通过',
        },
      ];
    } else {
      const canAccept = allow_accept_list.includes(this.props.selfUUID);

      return canAccept
        ? [
            {
              label: '接受',
              onClick: () => this.props.dispatch(acceptDiceRequest(uuid)),
            },
          ]
        : [
            {
              label: this.props.me ? '等待对方处理' : '等待处理',
            },
          ];
    }
  }
}

export default connect((state: TRPGState) => ({
  selfUUID: state.user.info.uuid!,
}))(DiceRequest);
