import React from 'react';
import { connect } from 'react-redux';
import type { TRPGState } from '@redux/types/__all__';

import './NetworkIndicator.scss';

interface Props {
  network: any;
}
/**
 * 网络状态指示器
 */
const NetworkIndicator: React.FC<Props> = React.memo((props) => {
  const network = props.network;
  let icon = '';
  let state = '';
  if (network.isOnline === true) {
    state = 'ok';
    icon = '&#xe620;';
  } else {
    if (network.tryReconnect === true) {
      state = 'loading';
      icon = '&#xeb0f;';
    } else {
      state = 'close';
      icon = '&#xe70c;';
    }
  }

  return (
    <div className={'network-indicator ' + state}>
      <div className="icon">
        <i className="iconfont" dangerouslySetInnerHTML={{ __html: icon }} />
      </div>
      <div className="msg">{network.msg}</div>
    </div>
  );
});

export default connect((state: TRPGState) => ({
  network: state.ui.network,
}))(NetworkIndicator);
