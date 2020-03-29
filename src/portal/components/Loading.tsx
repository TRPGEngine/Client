import React from 'react';
import { Row, Spin } from 'antd';
import { TMemo } from '@shared/components/TMemo';

const Loading = TMemo(() => (
  <Row justify="center">
    <Spin />
  </Row>
));
Loading.displayName = 'Loading';

export default Loading;
