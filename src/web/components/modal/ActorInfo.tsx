import React from 'react';
import ModalPanel from '../ModalPanel';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import XMLBuilder from '@shared/components/layout/XMLBuilder';
import { Row } from 'antd';
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
        <XMLBuilder
          xml={props.layout}
          initialData={props.data}
          layoutType="detail"
        />
      </Container>
    </ModalPanel>
  );
};

export default ActorInfo;
