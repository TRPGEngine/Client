const React = require('react');
const { connect } = require('react-redux');
const PropTypes = require('prop-types');
const ActorProfile = require('../../../../components/ActorProfile');
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
    return (
      <div className="group-actor-check">
        <h2>人物审核</h2>
        <ActorProfile actor={groupActor.actor}/>
        <div className="actions">
          <button onClick={() => this._handleRefuse()}><i className="iconfont">&#xe680;</i>拒绝</button>
          <button onClick={() => this._handleAgree()}><i className="iconfont">&#xe66b;</i>通过</button>
        </div>
      </div>
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
