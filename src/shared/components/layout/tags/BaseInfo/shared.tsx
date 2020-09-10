import styled from 'styled-components';
import { Form } from 'antd';
import { Row } from 'antd';

export const BaseInfoContainer = styled(Row).attrs({
  type: 'flex',
})`
  flex-wrap: wrap-reverse !important;
  margin-bottom: 10px;
  border-bottom: ${(props) => props.theme.border.standard};
  padding-top: 24px;
`;

export const BaseInfoForm = styled(Form).attrs({
  layout: 'vertical',
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
})``;
