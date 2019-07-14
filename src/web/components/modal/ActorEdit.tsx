import React, { useState } from 'react';
import ModalPanel from '../ModalPanel';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import XMLBuilder from '@shared/layout/XMLBuilder';
import { Col, Row, Avatar, Button } from 'antd';
import styled from 'styled-components';

/**
 * 人物卡编辑模态框
 */

const Container = styled(Row)`
  width: 600px;
`;

interface Props {
  name?: string;
  desc?: string;
  avatar?: string;
  data: {};
  layout: string;
  onSave?: (data: any) => void;
}
const ActorInfo = (props: Props) => {
  const [actorData, setActorData] = useState(props.data);

  let title = '人物卡';
  if (!_isNil(props.name)) {
    title += ' - ' + props.name;
  }

  const actions = (
    <Button onClick={() => props.onSave && props.onSave(actorData)}>
      保存
    </Button>
  );

  return (
    <ModalPanel title={title} actions={actions}>
      <Container>
        <Col xs={8}>
          <Avatar shape="square" size={128} src={props.avatar} />
          <div>{props.name}</div>
          <div>
            <pre>{props.desc}</pre>
          </div>
        </Col>
        <Col xs={16}>
          <XMLBuilder
            xml={props.layout}
            initialData={props.data}
            layoutType="edit"
            onChange={(newState) => setActorData(newState.data)}
          />
        </Col>
      </Container>
    </ModalPanel>
  );
};

export default ActorInfo;
