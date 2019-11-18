import React from 'react';
import { RouteComponentProps } from 'react-router';
import {
  fetchTemplateInfo,
  fetchActorDetail,
  fetchActorAccess,
} from '@portal/model/actor';
import XMLBuilder from '@shared/layout/XMLBuilder';
import Loading from '@portal/components/Loading';
import { ActionButton } from '@portal/components/ActionButton';
import _get from 'lodash/get';

interface Props
  extends RouteComponentProps<{
    actorUUID: string;
  }> {}

class ActorDetail extends React.Component<Props> {
  state = {
    actorAccess: {},
    actorInfo: {},
    templateLayout: '',
  };

  get actorUUID(): string {
    return this.props.match.params.actorUUID;
  }

  async componentDidMount() {
    const access = await fetchActorAccess(this.actorUUID);
    const actor = await fetchActorDetail(this.actorUUID);
    const template = await fetchTemplateInfo(actor.template_uuid);

    this.setState({
      actorAccess: access,
      actorInfo: actor.info,
      templateLayout: template.layout,
    });
  }

  render() {
    const { actorAccess, actorInfo, templateLayout } = this.state;
    if (templateLayout === '') {
      return <Loading />;
    }

    return (
      <div>
        <XMLBuilder
          xml={templateLayout}
          layoutType="detail"
          initialData={actorInfo}
        />
        {_get(actorAccess, 'editable') === true ? (
          <ActionButton type="primary">编辑</ActionButton>
        ) : null}
      </div>
    );
  }
}

export default ActorDetail;
