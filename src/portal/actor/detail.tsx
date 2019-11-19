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
import history from '@portal/history';
import ActorEditor from '@portal/components/ActorEditor';

interface Props
  extends RouteComponentProps<{
    actorUUID: string;
  }> {}

class ActorDetail extends React.Component<Props> {
  state = {
    actorAccess: {},
  };

  get actorUUID(): string {
    return this.props.match.params.actorUUID;
  }

  async componentDidMount() {
    const access = await fetchActorAccess(this.actorUUID);

    this.setState({
      actorAccess: access,
    });
  }

  handleEditActor = () => {
    history.push(`/actor/edit/${this.actorUUID}`);
  };

  render() {
    const { actorAccess } = this.state;

    return (
      <ActorEditor actorUUID={this.actorUUID} type="detail">
        {_get(actorAccess, 'editable') === true ? (
          <ActionButton type="primary" onClick={this.handleEditActor}>
            编辑
          </ActionButton>
        ) : null}
      </ActorEditor>
    );
  }
}

export default ActorDetail;
