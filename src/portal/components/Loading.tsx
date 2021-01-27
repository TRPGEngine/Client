import React from 'react';
import { Row, Spin } from 'antd';
import { TMemo } from '@shared/components/TMemo';
import type { RowProps } from 'antd/lib/row';

const Loading: React.FC<RowProps> = TMemo((props) => (
  <Row justify="center" {...props}>
    <Spin />
  </Row>
));
Loading.displayName = 'Loading';

export default Loading;
