import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import ModalPanel from '@web/components/ModalPanel';
import { useFormik } from 'formik';
import { Form, Button, Input } from 'antd';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { createGroupChannel } from '@redux/actions/group';

interface ChannelFormValues {
  name: string;
  desc: string;
}

const initialValues: ChannelFormValues = {
  name: '',
  desc: '',
};

interface Props {
  groupUUID: string;
}
export const GroupChannelCreate: React.FC<Props> = TMemo((props) => {
  const dispatch = useTRPGDispatch();
  const { values, handleSubmit, handleChange } = useFormik<ChannelFormValues>({
    initialValues,
    onSubmit: async (values) => {
      const { name, desc } = values;
      dispatch(createGroupChannel(props.groupUUID, name, desc));
    },
  });

  return (
    <ModalPanel
      title="创建频道"
      actions={<Button onClick={() => handleSubmit()}>提交</Button>}
      style={{ width: 425 }}
    >
      <Form layout="horizontal" labelCol={{ sm: 6 }} wrapperCol={{ sm: 18 }}>
        <Form.Item label="频道名称:">
          <Input
            name="name"
            size="large"
            value={values.name}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item label="频道描述:">
          <Input.TextArea
            name="desc"
            autoSize={{
              maxRows: 4,
              minRows: 2,
            }}
            value={values.desc}
            onChange={handleChange}
          />
        </Form.Item>
      </Form>
    </ModalPanel>
  );
});
GroupChannelCreate.displayName = 'GroupChannelCreate';
