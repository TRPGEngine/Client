import React from 'react';
import { RouteComponentProps } from 'react-router';
import { TemplateItem, fetchTemplateInfo } from '@portal/model/actor';
import XMLBuilder from '@shared/layout/XMLBuilder';
import _isNil from 'lodash/isNil';
import { Affix, Button } from 'antd';

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
  actorData = {};

  get templateUUID() {
    return this.props.match.params.templateUUID || '';
  }

  componentDidMount() {
    fetchTemplateInfo(this.templateUUID).then((template) => {
      this.setState({
        template,
      });
    });
  }

  handleCreateActor = () => {
    alert('TODO');
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
