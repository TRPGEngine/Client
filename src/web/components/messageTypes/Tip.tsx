import React from 'react';
import Base from './Base';
import { MsgItemTip } from './style';

class Tip extends Base {
  render() {
    const info = this.props.info;
    return (
      <MsgItemTip>
        <div className="content">{info.message}</div>
      </MsgItemTip>
    );
  }
}

export default Tip;
