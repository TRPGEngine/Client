import React from 'react';
import { Button, Row, Avatar, Col } from 'antd';
import { TemplateType } from './TemplateSelect';
import XMLBuilder, { DataMap } from '@shared/layout/XMLBuilder';
import styled from 'styled-components';

const BasicBlock = styled(Row)`
  background-color: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin: 10px 0;
  padding: 10px;
  border-radius: 3px;
`;

interface Props {
  template: TemplateType;
  data: DataMap;
}
const CreateActorConfirm = (props: Props) => {
  const template = props.template;
  const data = props.data;
  return (
    <div>
      <p>角色信息</p>
      <BasicBlock>
        <XMLBuilder
          xml={template.layout}
          initialData={data}
          layoutType="detail"
        />
      </BasicBlock>
    </div>
  );
};

export default CreateActorConfirm;
