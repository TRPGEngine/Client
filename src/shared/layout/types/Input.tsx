import React from 'react';
import Base, { BaseTypeRow } from './Base';
import { Input, Col } from 'antd';

export default class TInput extends Base {
  name = 'Input';

  getEditView(name, attributes, elements) {
    const { label } = attributes;

    const parsedLabel = label.replace(new RegExp('\\\\n', 'g'), '\n'); // 支持\n的渲染 拿到的换行符为\\n

    return (
      <BaseTypeRow>
        <Col span={6}>
          <pre>{parsedLabel}</pre>
        </Col>
        <Col span={18}>
          <Input placeholder={label} />
        </Col>
      </BaseTypeRow>
    );
  }
}
