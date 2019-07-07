import React from 'react';
import Base, { BaseTypeRow } from './Base';
import { XMLElementAttributes } from '../parser/xml-parser';
import { XMLBuilderContext } from '../XMLBuilder';
import { parseDataText } from '../processor';
import _get from 'lodash/get';
import _set from 'lodash/set';
import { Col, Input } from 'antd';
const TextArea = Input.TextArea;

export default class TTextArea extends Base {
  name = 'TextArea';

  getEditView(
    tagName,
    attributes: XMLElementAttributes,
    elements,
    context: XMLBuilderContext
  ) {
    const label = attributes.label as string;
    const name = attributes.name as string;
    const autosize = attributes.autosize as any;
    const isNumber: boolean = attributes.isNumber as any;

    const changeValue = attributes.changeValue as string; // 指定要被修改的变量
    const bindingName = parseDataText(name || label, context); // 可以为a.b的格式
    const { state, dispatch } = context;

    const parsedLabel = this.parseMultilineText(label); // Input标题

    return (
      <BaseTypeRow key={attributes.key}>
        <Col span={6}>
          <pre>{parsedLabel}</pre>
        </Col>
        <Col span={18}>
          <TextArea
            autosize={autosize}
            placeholder={label}
            value={this.getStateValue(context, bindingName)}
            onChange={(e) => {
              const { scope, field } = this.getOperationData(
                changeValue || bindingName
              );

              if (isNumber) {
                _set(state[scope], field, this.tryToNumber(e.target.value));
              } else {
                _set(state[scope], field, e.target.value);
              }

              dispatch({ type: 'update_data', payload: state[scope], scope });
            }}
          />
        </Col>
      </BaseTypeRow>
    );
  }
}
