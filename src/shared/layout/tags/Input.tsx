import React from 'react';
import Base, {
  BaseTypeRow,
  ILayoutType,
  ILayoutTypeAttributes,
  LayoutTypeContext,
} from './Base';
import { Input, Col } from 'antd';
import { XMLBuilderContext } from '../XMLBuilder';
import { XMLElementAttributes } from '../parser/xml-parser';
import _get from 'lodash/get';
import _set from 'lodash/set';
import { parseDataText } from '../processor';
import styled from 'styled-components';
import { tryToNumber, setStateValue, getStateValue } from './utils';

export const Label = styled.pre`
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface Attr extends ILayoutTypeAttributes {
  label?: string;
  name?: string;
  isNumber?: boolean;
  changeValue?: string;
  defaultValue?: string | number;
}

/**
 * Input 组件
 * 接受参数:
 * - label: 标题
 * - name: 显示的数据名。如果为空则取label
 * - changeValue: 要被修改的变量。如果为空则取name
 * - isNumber: 如果为true则无论输入什么都尝试转化为数字
 */
export default class TInput extends Base implements ILayoutType<Attr> {
  name = 'Input';

  getEditView({ attributes, context }: LayoutTypeContext<Attr>) {
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
          <Label title={parsedLabel}>{parsedLabel}</Label>
        </Col>
        <Col span={18}>
          <Input
            placeholder={label}
            value={getStateValue(context, bindingName)}
            onChange={(e) => {
              const { value } = e.target;

              setStateValue(
                context,
                changeValue || bindingName,
                isNumber ? tryToNumber(value) : value
              );
            }}
          />
        </Col>
      </BaseTypeRow>
    );
  }

  getDetailView({ attributes, context }: LayoutTypeContext<Attr>) {
    const label = attributes.label as string;
    const name = attributes.name as string;

    const bindingName = parseDataText(name || label, context); // 可以为a.b的格式
    const { state, dispatch } = context;

    const parsedLabel = this.parseMultilineText(label); // Input标题

    return (
      <BaseTypeRow key={attributes.key}>
        <Col span={6}>
          <Label title={parsedLabel}>{parsedLabel}</Label>
        </Col>
        <Col span={18}>
          <pre>{getStateValue(context, bindingName)}</pre>
        </Col>
      </BaseTypeRow>
    );
  }
}
