import React from 'react';
import { RouteComponentProps } from 'react-router';
import { fetchTemplateInfo, fetchActorDetail } from '@portal/model/actor';
import XMLBuilder from '@shared/layout/XMLBuilder';
import Loading from '@portal/components/Loading';

interface Props
  extends RouteComponentProps<{
    actorUUID: string;
  }> {}

class ActorDetail extends React.Component<Props> {
  state = {
    actorInfo: {},
    templateLayout: '',
  };

  get actorUUID(): string {
    return this.props.match.params.actorUUID;
  }

  async componentDidMount() {
    // this.setState({
    //   template,
    // });

    const actor = await fetchActorDetail(this.actorUUID);
    const template = await fetchTemplateInfo(actor.template_uuid);

    this.setState({
      actorInfo: actor.info,
      templateLayout: template.layout,
    });
  }

  render() {
    const { actorInfo, templateLayout } = this.state;
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
      </div>
    );
  }
}

export default ActorDetail;
