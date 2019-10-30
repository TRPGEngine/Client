import React from 'react';
import Base, {
  BaseTypeRow,
  ILayoutTypeAttributes,
  LayoutTypeContext,
} from './Base';
import { Select, Col } from 'antd';
import { XMLElementAttributes } from '../parser/xml-parser';
import { XMLBuilderContext } from '../XMLBuilder';
const Option = Select.Option;

interface Attr extends ILayoutTypeAttributes {
  label?: string;
  name?: string;
  options?: string;
}
export default class TSelect extends Base<Attr> {
  name = 'Select';

  getEditView({ attributes, context }: LayoutTypeContext<Attr>) {
    const { label, name, options } = attributes;
    const { state, dispatch } = context;
    const bindingName = name || label;
    const { data } = state;

    const parsedLabel = this.parseMultilineText(label as string);
    const opt = (options as string).split(',');

    // TODO: 数据处理还没做

    return (
      <BaseTypeRow key={attributes.key}>
        <Col span={6}>
          <pre>{parsedLabel}</pre>
        </Col>
        <Col span={18}>
          <Select
            style={{ width: '100%' }}
            placeholder="请选择..."
            value={data[bindingName]}
            onChange={(value) => {
              data[bindingName] = value;
              dispatch({ type: 'update_data', payload: data });
            }}
          >
            {opt.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Col>
      </BaseTypeRow>
    );
  }
}
