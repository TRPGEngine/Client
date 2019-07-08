import React from 'react';
import Base, { BaseTypeRow } from './Base';
import { Input, Col } from 'antd';
import { XMLBuilderContext } from '../XMLBuilder';
import { XMLElementAttributes } from '../parser/xml-parser';
import _get from 'lodash/get';
import _set from 'lodash/set';
import { parseDataText } from '../processor';

/**
 * Input 组件
 * 接受参数:
 * - label: 标题
 * - name: 显示的数据名。如果为空则取label
 * - changeValue: 要被修改的变量。如果为空则取name
 * - isNumber: 如果为true则无论输入什么都尝试转化为数字
 */
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
          <Input
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

  getDetailView(
    tagName,
    attributes: XMLElementAttributes,
    elements,
    context: XMLBuilderContext
  ) {
    const label = attributes.label as string;
    const name = attributes.name as string;

    const bindingName = parseDataText(name || label, context); // 可以为a.b的格式
    const { state, dispatch } = context;

    const parsedLabel = this.parseMultilineText(label); // Input标题

    return (
      <BaseTypeRow key={attributes.key}>
        <Col span={6}>
          <pre>{parsedLabel}</pre>
        </Col>
        <Col span={18}>
          <pre>{this.getStateValue(context, bindingName)}</pre>
        </Col>
      </BaseTypeRow>
    );
  }
}
