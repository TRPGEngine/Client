import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ModalPanel from '../../../../components/ModalPanel';
import ActorProfile from '../../../../components/modal/ActorProfile';
import {
  agreeGroupActor,
  refuseGroupActor,
  updateGroupActorInfo,
} from '../../../../../redux/actions/group';

import './GroupActorCheck.scss';

class GroupActorCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingData: props.groupActor.actor_info || {},
    };
  }

  _handleAgree() {
    this.props.agreeGroupActor(
      this.props.selectedGroupUUID,
      this.props.groupActor.uuid
    );
  }

  _handleRefuse() {
    this.props.refuseGroupActor(
      this.props.selectedGroupUUID,
      this.props.groupActor.uuid
    );
  }

  _handleEditData(key, value) {
    let tmp = Object.assign({}, this.state.editingData);
    tmp[key] = value;
    this.setState({ editingData: tmp });
  }

  _handleSaveActorData() {
    let groupActorInfo = {};
    for (var key in this.state.editingData) {
      if (this.state.editingData[key]) {
        groupActorInfo[key] = this.state.editingData[key];
      }
    }

    this.props.updateGroupActorInfo(
      this.props.selectedGroupUUID,
      this.props.groupActor.uuid,
      groupActorInfo
    );
  }

  render() {
    let groupActor = this.props.groupActor;
    let actions = (
      <div className="actions">
        <button onClick={() => this._handleSaveActorData()}>
          <i className="iconfont">&#xe634;</i>保存
        </button>
        <button onClick={() => this._handleRefuse()}>
          <i className="iconfont">&#xe680;</i>拒绝
        </button>
        <button onClick={() => this._handleAgree()}>
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
          onEditData={(k, v) => this._handleEditData(k, v)}
        />
      </ModalPanel>
    );
  }
}

GroupActorCheck.propTypes = {
  groupActor: PropTypes.object.isRequired,
};

export default connect(
  (state) => ({
    selectedGroupUUID: state.getIn(['group', 'selectedGroupUUID']),
  }),
  (dispatch) => ({
    agreeGroupActor: (...args) => dispatch(agreeGroupActor(...args)),
    refuseGroupActor: (...args) => dispatch(refuseGroupActor(...args)),
    updateGroupActorInfo: (...args) => dispatch(updateGroupActorInfo(...args)),
  })
)(GroupActorCheck);
