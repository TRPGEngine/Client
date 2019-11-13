import React from 'react';
import { RouteComponentProps } from 'react-router';
import {
  TemplateItem,
  fetchTemplateInfo,
  createActor,
} from '@portal/model/actor';
import XMLBuilder, { DataMap } from '@shared/layout/XMLBuilder';
import _isNil from 'lodash/isNil';
import { Affix, Button, notification } from 'antd';
import { checkToken } from '@portal/utils/auth';

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

  componentDidMount() {
    checkToken()
      .then(() => fetchTemplateInfo(this.templateUUID))
      .then((template) => {
        this.setState({
          template,
        });
      });
  }

  handleCreateActor = () => {
    createActor(this.templateUUID, this.actorData)
      .then(() =>
        notification.open({
          message: '创建成功',
        })
      )
      .catch((err) => {
        notification.error({
          message: '创建失败: ' + err,
        });
      });
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
              <Button type="primary" onClick={this.handleCreateActor}>
                创建人物
              </Button>
            </Affix>
          </div>
        )}
      </div>
    );
  }
}

export default ActorCreate;
