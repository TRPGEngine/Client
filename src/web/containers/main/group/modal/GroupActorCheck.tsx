import React from 'react';
import { connect } from 'react-redux';
import ModalPanel from '@web/components/ModalPanel';
import ActorProfile from '@web/components/modal/ActorProfile';
import {
  agreeGroupActor,
  refuseGroupActor,
  requestUpdateGroupActorInfo,
} from '@shared/redux/actions/group';
import { TRPGDispatch, TRPGState } from '@redux/types/__all__';

import './GroupActorCheck.scss';

interface Props {
  selectedGroupUUID: string;
  groupActor: any;

  agreeGroupActor: any;
  refuseGroupActor: any;
}
class GroupActorCheck extends React.Component<Props> {
  state = {
    editingData: this.props.groupActor.actor_info || {},
  };

  handleAgree() {
    this.props.agreeGroupActor(
      this.props.selectedGroupUUID,
      this.props.groupActor.uuid
    );
  }

  handleRefuse() {
    this.props.refuseGroupActor(
      this.props.selectedGroupUUID,
      this.props.groupActor.uuid
    );
  }

  handleEditData(key, value) {
    let tmp = Object.assign({}, this.state.editingData);
    tmp[key] = value;
    this.setState({ editingData: tmp });
  }

  render() {
    let groupActor = this.props.groupActor;
    let actions = (
      <div className="actions">
        <button onClick={() => this.handleRefuse()}>
          <i className="iconfont">&#xe680;</i>拒绝
        </button>
        <button onClick={() => this.handleAgree()}>
          <i className="iconfont">&#xe66b;</i>通过
        </button>
      </div>
    );
    return (
      <ModalPanel
        title="人物审核"
        actions={actions}
        className="group-actor-check"
      >
        <ActorProfile
          actor={groupActor.actor}
          canEdit={true}
          editingData={this.state.editingData}
          onEditData={(k, v) => this.handleEditData(k, v)}
        />
      </ModalPanel>
    );
  }
}

export default connect(
  (state: TRPGState) => ({
    selectedGroupUUID: state.group.selectedGroupUUID,
  }),
  (dispatch: TRPGDispatch) => ({
    agreeGroupActor: (groupUUID, groupActorUUID) =>
      dispatch(agreeGroupActor(groupUUID, groupActorUUID)),
    refuseGroupActor: (groupUUID, groupActorUUID) =>
      dispatch(refuseGroupActor(groupUUID, groupActorUUID)),
    requestUpdateGroupActorInfo: (
      groupUUID: string,
      groupActorUUID: string,
      groupActorInfo: {}
    ) =>
      dispatch(requestUpdateGroupActorInfo(groupUUID, groupActorUUID, groupActorInfo)),
  })
)(GroupActorCheck);
