import React from 'react';

import './IsDeveloping.scss';

const IsDeveloping: React.FC = React.memo((props) => {
  return (
    <div className="is-developing">
      <i className="iconfont">&#xe6bb;</i>
      <p>工程师正在开发中...</p>
    </div>
  );
});

export default IsDeveloping;
