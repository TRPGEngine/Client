import React from 'react';
import ModalPanel from '../ModalPanel';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import XMLBuilder from '@shared/layout/XMLBuilder';
import { Col, Row, Avatar } from 'antd';
import styled from 'styled-components';

/**
 * 人物卡信息模态框
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
}
const ActorInfo = (props: Props) => {
  let title = '人物卡';
  if (!_isNil(props.name)) {
    title += ' - ' + props.name;
  }

  return (
    <ModalPanel title={title}>
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
            layoutType="detail"
          />
        </Col>
      </Container>
    </ModalPanel>
  );
};

export default ActorInfo;
