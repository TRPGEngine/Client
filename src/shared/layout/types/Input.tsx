import React, { useContext } from 'react';
import Base, { BaseTypeRow } from './Base';
import { Input, Col } from 'antd';
import { XMLBuilderContext } from '../XMLBuilder';
import { XMLElementAttributes } from '../parser/xml-parser';

export default class TInput extends Base {
  name = 'Input';

  getEditView(
    tagName,
    attributes: XMLElementAttributes,
    elements,
    context: XMLBuilderContext
  ) {
    const label = attributes.label as string;
    const name = attributes.name as string;
    const bindingName = name || label;
    const { state, dispatch } = context;
    const { data } = state;

    const parsedLabel = this.parseMultilineText(label);

    return (
      <BaseTypeRow>
        <Col span={6}>
          <pre>{parsedLabel}</pre>
        </Col>
        <Col span={18}>
          <Input
            placeholder={label}
            value={data[bindingName]}
            onChange={(e) => {
              data[bindingName] = e.target.value;
              dispatch({ type: 'update_data', payload: data });
            }}
          />
        </Col>
      </BaseTypeRow>
    );
  }
}
