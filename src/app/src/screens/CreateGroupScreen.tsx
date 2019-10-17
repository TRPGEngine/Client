import React from 'react';
import { List, InputItem, TextareaItem } from '@ant-design/react-native';
import { Formik } from 'formik';
import { TButton } from '../components/TComponent';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { createGroup } from '@src/shared/redux/actions/group';
import { TRPGDispatchProp } from '@src/shared/redux/types/redux';

const Input = styled(InputItem).attrs((props) => ({
  styles: { text: { color: '#999' } },
  clear: true,
  ...props,
}))``;

interface Values {
  groupName: string;
  groupSubName: string;
  groupDesc: string;
}

interface Props extends TRPGDispatchProp {}
class CreateGroupScreen extends React.Component<Props> {
  handleSubmit = (values: Values) => {
    this.props.dispatch(
      createGroup(values.groupName, values.groupSubName, values.groupDesc)
    );
  };

  render() {
    return (
      <Formik<Values>
        initialValues={{ groupName: '', groupSubName: '', groupDesc: '' }}
        onSubmit={this.handleSubmit}
      >
        {({ values, handleChange, handleSubmit }) => (
          <List>
            <Input
              value={values.groupName}
              onChange={handleChange('groupName')}
            >
              团名
            </Input>
            <Input
              value={values.groupSubName}
              onChange={handleChange('groupSubName')}
            >
              团副名
            </Input>
            <TextareaItem
              rows={4}
              placeholder="写点什么来介绍一下你的团吧"
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

export default connect()(CreateGroupScreen);
