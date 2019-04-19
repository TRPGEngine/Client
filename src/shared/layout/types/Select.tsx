import React from 'react';
import Base, { BaseTypeRow } from './Base';
import { Select, Col } from 'antd';
import { XMLElementAttributes } from '../parser/xml-parser';
const Option = Select.Option;

export default class TSelect extends Base {
  name = 'Select';

  getEditView(tagName, attributes: XMLElementAttributes, elements, context) {
    const { label, options } = attributes;

    const parsedLabel = this.parseMultilineText(label as string);
    const opt = (options as string).split(',');

    // TODO: 数据处理还没做

    return (
      <BaseTypeRow>
        <Col span={6}>
          <pre>{parsedLabel}</pre>
        </Col>
        <Col span={18}>
          <Select>
            {opt.map((item) => (
              <Option key={item} value={item}>
                item
              </Option>
            ))}
          </Select>
        </Col>
      </BaseTypeRow>
    );
  }
}
