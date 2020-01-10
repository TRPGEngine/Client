import React from 'react';
import Base from './Base';
import { MsgPayload } from '@src/shared/redux/types/chat';
import BBCode from './bbcode/__all__';

class Default extends Base {
  getContent() {
    const info = this.props.info || ({} as MsgPayload);
    return (
      <pre className="bubble">
        <BBCode plainText={info.message} />
      </pre>
    );
  }
}

export default Default;
