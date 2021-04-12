import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import ModalPanel from '../../ModalPanel';
import { Button, Steps, Row, message } from 'antd';
import type { DataMap } from '@shared/components/layout/XMLBuilder';
import {
  getSuggestTemplate,
  createActor,
} from '@src/shared/redux/actions/actor';
import TemplateSelect from './TemplateSelect';
import CreateActorDetail from './CreateActorDetail';
import CreateActorConfirm from './CreateActorConfirm';
import _get from 'lodash/get';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';
import { toAvatarWithBlobUrl } from '@web/utils/upload-helper';
import { isBlobUrl } from '@shared/utils/string-helper';
import type { AvatarUpdateData } from '@shared/utils/upload-helper';
import type { ActorTemplateType } from '@redux/types/actor';
import { TMemo } from '@shared/components/TMemo';
import { useTRPGSelector, useTRPGDispatch } from '@redux/hooks/useTRPGSelector';
const Step = Steps.Step;

const Container = styled.div`
  min-height: 420px;
  min-width: 600px;
  text-align: left;
`;

const ContainerBody = styled.div`
  padding: 20px 0;
`;

const Actions = styled(Row).attrs(() => ({
  type: 'flex',
  justify: 'space-between',
}))`
  padding: 0 10px;
`;

const ActorCreate: React.FC = TMemo(() => {
  const [current, setCurrent] = useState(0);
  const [
    selectedTemplate,
    setSelectedTemplate,
  ] = useState<ActorTemplateType | null>(null);
  const [stateData, setStateData] = useState<DataMap>({});
  const selfUUID = useTRPGSelector((state) => state.user.info.uuid!);
  const dispatch = useTRPGDispatch();

  const handleCreateActor = async () => {
    console.log('正在检查数据');
    if (
      _isNil(stateData) ||
      _isEmpty(stateData._name) ||
      _isEmpty(selectedTemplate)
    ) {
      message.error('无法创建, 请检查输入');
      return;
    }

    const avatarUrl = stateData._avatar;
    let avatar: AvatarUpdateData;
    if (_isString(avatarUrl) && isBlobUrl(avatarUrl)) {
      console.log('上传头像...');
      avatar = await toAvatarWithBlobUrl(selfUUID, avatarUrl).catch((err) => {
        message.error(_get(err, 'response.data.msg', 'Error: 上传失败'));
        throw err;
      });
      stateData._avatar = avatar.url; // 为服务端路径
    }

    console.log('创建人物...');
    dispatch(
      createActor(
        stateData._name!,
        stateData._avatar!,
        stateData._desc!,
        stateData,
        selectedTemplate!.uuid,
        _get(avatar!, 'uuid')
      )
    );
  };

  const steps = [
    <TemplateSelect
      key="select"
      onSelectTemplate={(template) => {
        setSelectedTemplate(template);
        setCurrent(current + 1);
      }}
    />,
    <CreateActorDetail
      key="create"
      template={selectedTemplate!}
      data={stateData}
      onChange={setStateData}
    />,
    <CreateActorConfirm
      key="confirm"
      template={selectedTemplate!}
      data={stateData}
    />,
  ];

  // 操作
  const maxStep = steps.length - 1;
  const actions = useMemo(
    () => (
      <Actions>
        <Button
          disabled={!(current !== 0)}
          style={{ visibility: current !== 0 ? 'visible' : 'hidden' }}
          onClick={() => setCurrent(Math.max(0, current - 1))}
        >
          上一步
        </Button>

        {current === maxStep ? (
          <Button onClick={handleCreateActor}>创建人物</Button>
        ) : (
          <Button
            disabled={!(current !== maxStep && !!selectedTemplate)}
            style={{ visibility: current !== maxStep ? 'visible' : 'hidden' }}
            onClick={() => setCurrent(Math.min(maxStep, current + 1))}
          >
            下一步
          </Button>
        )}
      </Actions>
    ),
    [current, setCurrent, maxStep, handleCreateActor, selectedTemplate]
  );

  // 获取推荐模板
  useEffect(() => {
    dispatch(getSuggestTemplate());
  });

  return useMemo(
    () => (
      <ModalPanel title="创建人物" allowMaximize={true} actions={actions}>
        <Container>
          <Steps current={current}>
            <Step title="选择模板" />
            <Step title="设置属性" />
            <Step title="完成" />
          </Steps>

          <ContainerBody>{steps[current]}</ContainerBody>
        </Container>
      </ModalPanel>
    ),
    [actions, current, steps[current]]
  );
});
ActorCreate.displayName = 'ActorCreate';

export default ActorCreate;
