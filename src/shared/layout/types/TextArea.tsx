import React from 'react';
import {
  BaseTypeRow,
  BaseAttributes,
  ILayoutType,
  ILayoutTypeAttributes,
} from './Base';
import { XMLElementAttributes } from '../parser/xml-parser';
import { XMLBuilderContext } from '../XMLBuilder';
import { parseDataText } from '../processor';
import _get from 'lodash/get';
import _set from 'lodash/set';
import { Col, Input } from 'antd';
import TInput, { Label } from './Input';
const TextArea = Input.TextArea;

interface Attr extends ILayoutTypeAttributes {
  label?: string;
  name?: string;
  autosize?: boolean;
  changeValue?: string;
  isNumber?: boolean;
}
export default class TTextArea extends TInput implements ILayoutType<Attr> {
  name = 'TextArea';

  getEditView(tagName, attributes: Attr, elements, context: XMLBuilderContext) {
    const label = attributes.label;
    const name = attributes.name;
    const autosize = attributes.autosize;
    const isNumber: boolean = attributes.isNumber;

    const changeValue = attributes.changeValue as string; // 指定要被修改的变量
    const bindingName = parseDataText(name || label, context); // 可以为a.b的格式
    const { state, dispatch } = context;

    const parsedLabel = this.parseMultilineText(label); // Input标题

    return (
      <BaseTypeRow key={attributes.key}>
        <Col span={6}>
          <Label title={parsedLabel}>{parsedLabel}</Label>
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
