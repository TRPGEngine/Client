import React, { useMemo } from 'react';
import ModalPanel from '../ModalPanel';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _isString from 'lodash/isString';
import _cloneDeep from 'lodash/cloneDeep';
import XMLBuilder from '@shared/components/layout/XMLBuilder';
import { Row } from 'antd';
import styled from 'styled-components';
import { TMemo } from '@shared/components/TMemo';
import { useCachedActorTemplateInfo } from '@shared/hooks/cache';

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
  templateUUID: string;
}
const ActorInfo: React.FC<Props> = TMemo((props) => {
  let title = '人物卡';
  if (!_isNil(props.name)) {
    title += ' - ' + props.name;
  }

  const initialData = useMemo(() => {
    // 只在最初接受一次
    return _cloneDeep(props.data);
  }, []);

  const template = useCachedActorTemplateInfo(props.templateUUID);
  const layout = _get(template, 'layout');

  return useMemo(
    () =>
      _isString(layout) && (
        <ModalPanel title={title}>
          <Container>
            <XMLBuilder
              xml={layout}
              initialData={initialData}
              layoutType="detail"
            />
          </Container>
        </ModalPanel>
      ),
    [layout, initialData]
  );
});
ActorInfo.displayName = 'ActorInfo';

export default ActorInfo;
