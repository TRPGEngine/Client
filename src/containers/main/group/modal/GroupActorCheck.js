const React = require('react');
const { connect } = require('react-redux');
const PropTypes = require('prop-types');
const ModalPanel = require('../../../../components/ModalPanel');
const ActorProfile = require('../../../../components/modal/ActorProfile');
const { agreeGroupActor, refuseGroupActor } = require('../../../../redux/actions/group');

require('./GroupActorCheck.scss');

class GroupActorCheck extends React.Component {
  _handleAgree() {
    this.props.agreeGroupActor(this.props.selectedGroupUUID, this.props.groupActor.uuid);
  }

  _handleRefuse() {
    this.props.refuseGroupActor(this.props.selectedGroupUUID, this.props.groupActor.uuid);
  }

  render() {
    // TODO 需要允许进行修改人物属性
    console.log(this.props.groupActor);
    let groupActor = this.props.groupActor;
    let actions = (
      <div className="actions">
        <button onClick={() => this._handleRefuse()}><i className="iconfont">&#xe680;</i>拒绝</button>
        <button onClick={() => this._handleAgree()}><i className="iconfont">&#xe66b;</i>通过</button>
      </div>
    )
    return (
      <ModalPanel title="人物审核" actions={actions} className="group-actor-check">
        <ActorProfile actor={groupActor.actor}/>
      </ModalPanel>
    )
  }
}

GroupActorCheck.propTypes = {
  groupActor: PropTypes.object.isRequired,
}

module.exports = connect(
  state => ({
    selectedGroupUUID: state.getIn(['group', 'selectedGroupUUID']),
  }),
  dispatch => ({
    agreeGroupActor: (...args) => dispatch(agreeGroupActor(...args)),
    refuseGroupActor: (...args) => dispatch(refuseGroupActor(...args)),
  })
)(GroupActorCheck);
