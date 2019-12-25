import React from 'react';
import { connect } from 'react-redux';
import { ActorType, ActorDataType } from '@src/shared/redux/types/actor';
import XMLBuilder from '@shared/layout/XMLBuilder';
import styled from 'styled-components';
import { TRPGState } from '@redux/types/__all__';

const Container = styled.div`
  width: 700px;
  height: 500px;
  padding: 10px;
`;

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
    const actor = this.props.actor;
    const template = this.props.templateCache.get(actor.template_uuid);

    return <Container>{this.getActorProperty(actor, template)}</Container>;
  }
}

export default connect((state: TRPGState) => ({
  templateCache: state.cache.template,
}))(ActorProfile);
