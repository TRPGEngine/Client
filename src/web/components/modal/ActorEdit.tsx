import React, { useState } from 'react';
import ModalPanel from '../ModalPanel';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _isFunction from 'lodash/isFunction';
import XMLBuilder from '@shared/layout/XMLBuilder';
import { Row, Button } from 'antd';
import styled from 'styled-components';

/**
 * 人物卡编辑模态框
 */

const Container = styled(Row)`
  min-width: 600px;
`;

interface Props {
  name?: string;
  desc?: string;
  avatar?: string;
  data?: {};
  layout?: string;
  onSave?: (data: any) => void;
}
const ActorEdit: React.FC<Props> = (props) => {
  const [actorData, setActorData] = useState(props.data);

  let title = '人物卡';
  if (!_isNil(props.name)) {
    title += ' - ' + props.name;
  }

  const actions = (
    <Button
      onClick={() => _isFunction(props.onSave) && props.onSave(actorData)}
    >
      保存
    </Button>
  );

  return (
    <ModalPanel title={title} actions={actions} allowMaximize={true}>
      <Container>
        <XMLBuilder
          xml={props.layout}
          initialData={props.data}
          layoutType="edit"
          onChange={(newState) => setActorData(newState.data)}
        />
      </Container>
    </ModalPanel>
  );
};
ActorEdit.defaultProps = {
  data: {},
  layout: '',
};

export default ActorEdit;
