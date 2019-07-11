import React from 'react';
import { Row, Col, Input, Form } from 'antd';
import _get from 'lodash/get';
import _set from 'lodash/set';
import _clone from 'lodash/clone';
import AvatarPicker from '@components/AvatarPicker';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

export interface BaseActorInfoType {
  name: string;
  desc: string;
  avatar: string;
}

interface Props {
  value: BaseActorInfoType;
  onChange: (data: BaseActorInfoType) => void;
}
const CreateActorBase = (props: Props) => {
  const handleChange = <T extends keyof BaseActorInfoType>(
    field: T,
    value: BaseActorInfoType[T]
  ) => {
    const newValue = _clone(props.value);
    _set(newValue, field, value);
    props.onChange(newValue);
  };

  return (
    <div>
      <Row>
        <Col xs={18}>
          <Form
            layout="horizontal"
            labelCol={{ xs: 6 }}
            wrapperCol={{ xs: 18 }}
          >
            <FormItem label="名称" required>
              <Input
                value={_get(props, 'value.name', '')}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </FormItem>
            <FormItem label="描述">
              <TextArea
                autosize={{ maxRows: 8, minRows: 4 }}
                value={_get(props, 'value.desc', '')}
                onChange={(e) => handleChange('desc', e.target.value)}
              />
            </FormItem>
          </Form>
        </Col>
        <Col xs={6} style={{ textAlign: 'center' }}>
          <AvatarPicker
            imageUrl={_get(props, 'value.avatar', '')}
            onChange={(imageUrl) => handleChange('avatar', imageUrl)}
          />
        </Col>
      </Row>
    </div>
  );
};

export default CreateActorBase;
