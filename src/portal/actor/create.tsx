import React from 'react';
import { RouteComponentProps } from 'react-router';
import {
  TemplateItem,
  fetchTemplateInfo,
  createActor,
} from '@portal/model/actor';
import XMLBuilder, { DataMap } from '@shared/layout/XMLBuilder';
import _isNil from 'lodash/isNil';
import { Affix, notification } from 'antd';
import { checkToken } from '@portal/utils/auth';
import history from '../history';
import { ActionButton } from '@portal/components/ActionButton';

interface Props
  extends RouteComponentProps<{
    templateUUID: string;
  }> {}

interface State {
  template: TemplateItem;
}

class ActorCreate extends React.Component<Props, State> {
  state = {
    template: null,
  };
  actorData: DataMap = {};

  get templateUUID() {
    return this.props.match.params.templateUUID || '';
  }

  async componentDidMount() {
    await checkToken();
    const template = await fetchTemplateInfo(this.templateUUID);

    this.setState({
      template,
    });
  }

  handleCreateActor = async () => {
    try {
      await createActor(this.templateUUID, this.actorData);

      notification.open({
        message: '创建成功, 1秒后自动跳转',
      });
      setTimeout(() => history.push('/actor/list'), 1000);
    } catch (e) {
      notification.error({
        message: '创建失败: ' + e,
      });
    }
  };

  render() {
    const { template } = this.state;
    return (
      <div>
        {!_isNil(template) && (
          <div>
            <XMLBuilder
              xml={template.layout}
              onChange={({ data }) => (this.actorData = data)}
            />
            <Affix offsetBottom={10}>
              <ActionButton type="primary" onClick={this.handleCreateActor}>
                创建人物
              </ActionButton>
            </Affix>
          </div>
        )}
      </div>
    );
  }
}

export default ActorCreate;
