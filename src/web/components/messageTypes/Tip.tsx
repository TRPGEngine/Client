import React from 'react';
import Base from './Base';

class Tip extends Base {
  render() {
    const info = this.props.info;
    return (
      <div className="msg-item-tip">
        <div className="content">{info.message}</div>
      </div>
    );
  }
}

export default Tip;
