import React from 'react';
import Base from './Base';
import { Progress } from 'antd';

class Default extends Base {
  getContent() {
    const info = this.props.info;
    const data = info.data;
    const progress: number = data.progress || 0; // 0~1的浮点数
    const percent = progress > 0 ? Number((progress * 100).toFixed(2)) : 0;
    return (
      <div className="bubble" style={{ width: 120 }}>
        <Progress percent={percent} size="small" status="active" />
      </div>
    );
  }
}

export default Default;
