import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import ModalPanel from '@web/components/ModalPanel';
import { useFormik } from 'formik';
import { Form, Input, Button, InputNumber } from 'antd';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { createGroupMap } from '@redux/actions/group';

const initialValues = {
  name: '',
  width: 20,
  height: 15,
};

const formItemLayout = {
  labelCol: { sm: 6 },
  wrapperCol: { sm: 18 },
};

export const CreateGroupMap: React.FC<{
  groupUUID: string;
}> = TMemo((props) => {
  const dispatch = useTRPGDispatch();
  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues,
    onSubmit: (data) => {
      dispatch(
        createGroupMap(props.groupUUID, data.name, data.width, data.height)
      );
    },
  });

  const actions = useMemo(
    () => <Button onClick={() => handleSubmit()}>确定</Button>,
    [handleSubmit]
  );

  return (
    <ModalPanel title="创建地图" actions={actions}>
      <Form {...formItemLayout}>
        <Form.Item label="地图名">
          <Input name="name" value={values.name} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="宽(格数)">
          <InputNumber
            name="width"
            style={{ width: '100%' }}
            step={5}
            min={0}
            max={100}
            value={values.width}
            onChange={(val) => setFieldValue('width', val)}
          />
        </Form.Item>
        <Form.Item label="高(格数)">
          <InputNumber
            name="height"
            style={{ width: '100%' }}
            step={5}
            min={0}
            max={100}
            value={values.height}
            onChange={(val) => setFieldValue('height', val)}
          />
        </Form.Item>
      </Form>
    </ModalPanel>
  );
});
CreateGroupMap.displayName = 'CreateGroupMap';
