import React from 'react';
import { Button, Row, Avatar, Col } from 'antd';
import { TemplateType } from './TemplateSelect';
import XMLBuilder, { DataType } from '@shared/layout/XMLBuilder';
import { BaseActorInfoType } from './CreateActorBase';
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
  baseInfo: BaseActorInfoType;
  data: DataType;
}
const CreateActorConfirm = (props: Props) => {
  const template = props.template;
  const baseInfo = props.baseInfo;
  const data = props.data;
  return (
    <div>
      <p>角色信息</p>
      <BasicBlock>
        <Col xs={18}>
          <p>名称: </p>
          <p>{baseInfo.name}</p>
          <p>描述:</p>
          <p>
            <pre>{baseInfo.desc}</pre>
          </p>
        </Col>
        <Col xs={6}>
          <Avatar size={64} icon="user" src={baseInfo.avatar} />
        </Col>
      </BasicBlock>
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
