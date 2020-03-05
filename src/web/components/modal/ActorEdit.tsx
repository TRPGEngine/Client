import React, { useState, useMemo } from 'react';
import ModalPanel from '../ModalPanel';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _isString from 'lodash/isString';
import _isFunction from 'lodash/isFunction';
import _cloneDeep from 'lodash/cloneDeep';
import XMLBuilder from '@shared/components/layout/XMLBuilder';
import { Row, Button } from 'antd';
import styled from 'styled-components';
import { TMemo } from '@shared/components/TMemo';
import { useCachedActorTemplateInfo } from '@shared/hooks/cache';

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
  templateUUID: string;
  onSave?: (data: any) => void;
}
const ActorEdit: React.FC<Props> = TMemo((props) => {
  const [actorData, setActorData] = useState(_cloneDeep(props.data));

  let title = '人物卡';
  if (!_isNil(props.name)) {
    title += ' - ' + props.name;
  }

  const actions = useMemo(
    () => (
      <Button
        onClick={() => _isFunction(props.onSave) && props.onSave(actorData)}
      >
        保存
      </Button>
    ),
    [props.onSave, actorData]
  );

  const template = useCachedActorTemplateInfo(props.templateUUID);
  const layout = _get(template, 'layout');

  return useMemo(
    () =>
      _isString(layout) && (
        <ModalPanel title={title} actions={actions} allowMaximize={true}>
          <Container>
            <XMLBuilder
              xml={layout}
              initialData={actorData}
              layoutType="edit"
              onChange={(newState) => setActorData(newState.data)}
            />
          </Container>
        </ModalPanel>
      ),
    [layout, title, actions, actorData, setActorData]
  );
});
ActorEdit.defaultProps = {
  data: {},
};
ActorEdit.displayName = 'ActorEdit';

export default ActorEdit;
