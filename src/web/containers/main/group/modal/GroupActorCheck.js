const React = require('react');
const { connect } = require('react-redux');
const PropTypes = require('prop-types');
const ModalPanel = require('../../../../components/ModalPanel');
const ActorProfile = require('../../../../components/modal/ActorProfile');
const { agreeGroupActor, refuseGroupActor } = require('../../../../../redux/actions/group');

require('./GroupActorCheck.scss');

class GroupActorCheck extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.groupActor);
    this.state = {
      editingData: props.groupActor.actor_info || {},
    }
    console.log(this.state.editingData);
  }

  _handleAgree() {
    this.props.agreeGroupActor(this.props.selectedGroupUUID, this.props.groupActor.uuid);
  }

  _handleRefuse() {
    this.props.refuseGroupActor(this.props.selectedGroupUUID, this.props.groupActor.uuid);
  }

  _handleEditData(key, value) {
    let tmp = Object.assign({}, this.state.editingData);
    tmp[key] = value;
    this.setState({editingData: tmp});
  }

  _handleSaveActorData() {
    console.log(this.state.editingData);
    console.log('TODO: 更新远程团成员角色信息');
  }

  render() {
    let groupActor = this.props.groupActor;
    let actions = (
      <div className="actions">
        <button onClick={() => this._handleSaveActorData()}><i className="iconfont">&#xe634;</i>保存</button>
        <button onClick={() => this._handleRefuse()}><i className="iconfont">&#xe680;</i>拒绝</button>
        <button onClick={() => this._handleAgree()}><i className="iconfont">&#xe66b;</i>通过</button>
      </div>
    )
    return (
      <ModalPanel title="人物审核" actions={actions} className="group-actor-check">
        <ActorProfile
          actor={groupActor.actor}
          canEdit={true}
          editingData={this.state.editingData}
          onEditData={(k, v) => this._handleEditData(k, v)}
        />
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
