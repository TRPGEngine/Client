import React from 'react';
import Base from './Base';
import { TipMessage } from '../TipMessage';

class Tip extends Base {
  render() {
    const info = this.props.info;
    return <TipMessage text={info.message} />;
  }
}

export default Tip;
