import React from 'react';
import { regCup } from '@saucerjs/core';
import { Row, Space } from 'antd';
import { useTeaAttrsContext } from '@saucerjs/editor';

const CUP_NAME = 'Row';

regCup({
  name: CUP_NAME,
  displayName: '行',
  desc: '行容器',
  type: 'container',
  render({ nodeId, attrs, children }) {
    return (
      <Row key={nodeId} style={{ minHeight: 100, ...attrs.style }}>
        {children}
      </Row>
    );
  },
  editor() {
    return <Space direction="vertical">{/*  */}</Space>;
  },
});
