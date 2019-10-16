import React from 'react';
import { List, InputItem, TextareaItem } from '@ant-design/react-native';
import { Formik } from 'formik';
import { TButton } from '../components/TComponent';

class CreateGroupScreen extends React.Component {
  render() {
    return (
      <Formik
        initialValues={{ groupName: '', groupSubName: '', groupDesc: '' }}
        onSubmit={(values) => alert(JSON.stringify(values))}
      >
        {({ values, handleChange, handleSubmit }) => (
          <List>
            <InputItem
              clear
              value={values.groupName}
              onChange={handleChange('groupName')}
            >
              团名
            </InputItem>
            <InputItem
              clear
              value={values.groupSubName}
              onChange={handleChange('groupSubName')}
            >
              团副名
            </InputItem>
            <TextareaItem
              rows={4}
              value={values.groupDesc}
              onChange={handleChange('groupDesc')}
            />
            <List.Item>
              <TButton onPress={handleSubmit}>创建</TButton>
            </List.Item>
          </List>
        )}
      </Formik>
    );
  }
}

export default CreateGroupScreen;
