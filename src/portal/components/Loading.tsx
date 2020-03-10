import React from 'react';
import { Row, Spin } from 'antd';

const Loading = React.memo(() => (
  <Row justify="center">
    <Spin />
  </Row>
));

export default Loading;
