const React = require('react');
const { connect } = require('react-redux');
const PropTypes = require('prop-types');
const ActorProfile = require('../../../../components/ActorProfile');

require('./GroupActorCheck.scss');

class GroupActorCheck extends React.Component {
  render() {
    console.log(this.props.groupActorCheck);
    let groupActor = this.props.groupActor;
    return (
      <div className="group-actor-check">
        <h2>人物审核</h2>
        <ActorProfile actor={groupActor.actor}/>
        <div className="actions">
          <button><i className="iconfont">&#xe680;</i>拒绝</button>
          <button><i className="iconfont">&#xe66b;</i>通过</button>
        </div>
      </div>
    )
  }
}

GroupActorCheck.propTypes = {
  groupActor: PropTypes.object.isRequired,
}

module.exports = connect()(GroupActorCheck);
