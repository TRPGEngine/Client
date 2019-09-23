import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { ActorType, ActorDataType } from '@src/shared/redux/types/actor';
import { getOriginalImage } from '@shared/utils/file-helper';
import XMLBuilder from '@shared/layout/XMLBuilder';

import './ActorProfile.scss';

interface Props {
  actor: ActorType;
  canEdit?: boolean;
  editingData?: any;
  onEditData?: any;
  overwritedActorData?: ActorDataType; // 一般用于团角色的人物信息, 只读
  templateCache: any;
}
class ActorProfile extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    canEdit: false,
    editingData: {},
    overwritedActorData: {},
  };

  getActorProperty(actor, template) {
    if (!template) {
      console.error('缺少模板信息');
      return;
    }

    const initialData = Object.assign(
      {},
      actor.info,
      this.props.overwritedActorData
    );

    return (
      <XMLBuilder
        layoutType="detail"
        xml={template.get('layout', '')}
        initialData={initialData}
      />
    );
  }

  render() {
    let actor = this.props.actor;
    let template = this.props.templateCache.get(actor.template_uuid);

    return (
      <div className="actor-profile">
        <ReactTooltip effect="solid" id="property-desc" place="left" />
        <div className="profile">
          <div className="name">{actor.name}</div>
          <div className="uuid" title={actor.uuid}>
            {actor.uuid}
          </div>
          <div
            className="avatar"
            style={{
              backgroundImage: `url(${getOriginalImage(actor.avatar)})`,
            }}
          />
          <div className="desc">{actor.desc}</div>
        </div>
        <div className="property">{this.getActorProperty(actor, template)}</div>
      </div>
    );
  }
}

export default connect((state: any) => ({
  templateCache: state.getIn(['cache', 'template']),
}))(ActorProfile);
