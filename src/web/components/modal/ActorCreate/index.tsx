import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ModelPanel from '../../ModalPanel';
import { Button, Steps, Row, message } from 'antd';
import { connect, DispatchProp } from 'react-redux';
import { DataType } from '@shared/layout/XMLBuilder';
import { getSuggestTemplate, createActor } from '@redux/actions/actor';
import TemplateSelect, { TemplateType } from './TemplateSelect';
import CreateActorBase, { BaseActorInfoType } from './CreateActorBase';
import CreateActorDetail from './CreateActorDetail';
import CreateActorConfirm from './CreateActorConfirm';
import { toAvatar } from '@shared/utils/upload-helper';
import { blobFromUrl, blobToFile } from '@web/utils/file-helper';
const Step = Steps.Step;

const Container = styled.div`
  height: 420px;
  width: 600px;
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

interface Props extends DispatchProp<any> {
  selfUUID: string;
}
const ActorCreate = (props: Props) => {
  const maxStep = 3;
  const [current, setCurrent] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(null);
  const [stateData, setStateData] = useState<DataType>(null);

  const handleCreateActor = async () => {
    console.log('检查数据');
    if (!baseInfo.name || !stateData || !selectedTemplate) {
      message.error('无法创建, 请检查输入');
      return;
    }

    let avatarUrl = null;
    if (baseInfo.avatar) {
      console.log('上传头像...');
      const blobUrl = baseInfo.avatar;
      const blob = await blobFromUrl(blobUrl);
      const file = blobToFile(blob, 'avatar.jpg');
      const avatarRet = await toAvatar(props.selfUUID, file);
      avatarUrl = avatarRet.url; // 为服务端路径
    }

    console.log('创建人物...');
    props.dispatch(
      createActor(
        baseInfo.name,
        avatarUrl,
        baseInfo.desc,
        stateData,
        selectedTemplate.uuid
      )
    );
  };

  // 操作
  const actions = (
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
  );

  const [baseInfo, setBaseInfo] = useState<BaseActorInfoType>(
    {} as BaseActorInfoType
  );
  const steps = [
    <TemplateSelect
      onSelectTemplate={(template) => {
        setSelectedTemplate(template);
        setCurrent(current + 1);
      }}
    />,
    <CreateActorBase value={baseInfo} onChange={(data) => setBaseInfo(data)} />,
    <CreateActorDetail
      template={selectedTemplate}
      data={stateData}
      onChange={(data) => setStateData(data)}
    />,
    <CreateActorConfirm
      template={selectedTemplate}
      baseInfo={baseInfo}
      data={stateData}
    />,
  ];

  // 获取推荐模板
  useEffect(() => {
    props.dispatch(getSuggestTemplate());
  });
  return (
    <ModelPanel title="创建人物" actions={actions}>
      <Container>
        <Steps current={current}>
          <Step title="选择模板" />
          <Step title="创建人物" />
          <Step title="补充属性" />
          <Step title="完成" />
        </Steps>

        <ContainerBody>{steps[current]}</ContainerBody>
      </Container>
    </ModelPanel>
  );
};

export default connect((state: any) => ({
  selfUUID: state.getIn(['user', 'info', 'uuid']),
}))(ActorCreate);
