import BaseCard, { BaseCardProps } from './BaseCard';
import { connect, DispatchProp } from 'react-redux';
import { acceptDiceRequest } from '../../../../shared/redux/actions/dice';

// 投骰请求
interface Props extends BaseCardProps, DispatchProp<any> {
  selfUUID: any;
  me: any;
}
class DiceRequest extends BaseCard<Props> {
  getCardBtn() {
    let info = this.props.info;
    let data = info.data;
    let uuid = info.uuid;
    let is_accept = data.is_accept;
    let allow_accept_list = data.allow_accept_list;

    if (is_accept) {
      return [
        {
          label: '已通过',
        },
      ];
    } else {
      let canAccept = allow_accept_list.includes(this.props.selfUUID);

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

export default connect((state: any) => ({
  selfUUID: state.getIn(['user', 'info', 'uuid']),
}))(DiceRequest);
