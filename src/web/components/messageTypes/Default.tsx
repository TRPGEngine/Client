import React from 'react';
import Base from './Base';
import msgParser from '../../../shared/utils/msg-parser';
import { MsgPayload } from '@src/shared/redux/types/chat';

class Default extends Base {
  getContent() {
    const info = this.props.info || ({} as MsgPayload);
    return <pre className="bubble">{msgParser(info.message)}</pre>;
  }
}

export default Default;
