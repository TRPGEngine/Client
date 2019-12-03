import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ModalPanel from '../../ModalPanel';
import { Button, Steps, Row, message } from 'antd';
import { connect, DispatchProp } from 'react-redux';
import { DataMap } from '@shared/layout/XMLBuilder';
import {
  getSuggestTemplate,
  createActor,
} from '@src/shared/redux/actions/actor';
import TemplateSelect, { TemplateType } from './TemplateSelect';
import CreateActorDetail from './CreateActorDetail';
import CreateActorConfirm from './CreateActorConfirm';
import _get from 'lodash/get';
import _isString from 'lodash/isString';
import { toAvatarWithBlobUrl } from '@web/utils/upload-helper';
import { isBlobUrl } from '@shared/utils/string-helper';
import { AvatarUpdateData } from '@shared/utils/upload-helper';
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
  const [current, setCurrent] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(null);
  const [stateData, setStateData] = useState<DataMap>(null);

  const handleCreateActor = async () => {
    console.log('检查数据');
    if (!stateData._name || !stateData || !selectedTemplate) {
      message.error('无法创建, 请检查输入');
      return;
    }

    const avatarUrl = stateData._avatar;
    let avatar: AvatarUpdateData;
    if (_isString(avatarUrl) && isBlobUrl(avatarUrl)) {
      console.log('上传头像...');
      avatar = await toAvatarWithBlobUrl(props.selfUUID, avatarUrl).catch(
        (err) => {
          message.error(_get(err, 'response.data.msg', 'Error: 上传失败'));
          throw err;
        }
      );
      stateData._avatar = avatar.url; // 为服务端路径
    }

    console.log('创建人物...');
    props.dispatch(
      createActor(
        stateData._name,
        stateData._avatar,
        stateData._desc,
        stateData,
        selectedTemplate.uuid,
        _get(avatar, 'uuid')
      )
    );
  };

  const steps = [
    <TemplateSelect
      onSelectTemplate={(template) => {
        setSelectedTemplate(template);
        setCurrent(current + 1);
      }}
    />,
    <CreateActorDetail
      template={selectedTemplate}
      data={stateData}
      onChange={(data) => setStateData(data)}
    />,
    <CreateActorConfirm template={selectedTemplate} data={stateData} />,
  ];

  // 操作
  const maxStep = steps.length - 1;
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

  // 获取推荐模板
  useEffect(() => {
    props.dispatch(getSuggestTemplate());
  });
  return (
    <ModalPanel title="创建人物" actions={actions}>
      <Container>
        <Steps current={current}>
          <Step title="选择模板" />
          <Step title="设置属性" />
          <Step title="完成" />
        </Steps>

        <ContainerBody>{steps[current]}</ContainerBody>
      </Container>
    </ModalPanel>
  );
};

export default connect((state: any) => ({
  selfUUID: state.getIn(['user', 'info', 'uuid']),
}))(ActorCreate);
