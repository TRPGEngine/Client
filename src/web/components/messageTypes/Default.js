import React from 'react';
import Base from './Base';
import msgParser from '../../../shared/utils/msgParser';

class Default extends Base {
  getContent() {
    const info = this.props.info || {};
    return <pre className="bubble">{msgParser(info.message)}</pre>;
  }
}

export default Default;
