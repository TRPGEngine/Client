const React = require('react');
const { connect } = require('react-redux');
const { showAlert } = require('../../../redux/actions/ui');

require('./GroupActor.scss')

class GroupActor extends React.Component {
  _handleSendGroupActorCheck() {
    if(!this.props.selectedGroupUUID) {
      showAlert('请选择一个团来提交您的人物');
    }

    // TODO: 团人物审核模态框
  }

  getGroupActorsList() {
    let actors = this.props.groupInfo.get('group_actors');
    if(actors) {
      return actors.map((item) => {
        let originActor = item.get('actor');
        let actorData = originActor.get('info').merge(item.get('actor_info'));
        return (
          <div key={`group-actor#${item.get('uuid')}`}>
            <div>{item.get('avatar') || originActor.get('avatar')}</div>
            <div>{JSON.stringify(actorData.toJS())}</div>
          </div>
        )
      })
    }
  }

  render() {
    return (
      <div className="group-actor">
        <button onClick={() => this._handleSendGroupActorCheck()}><i className="iconfont">&#xe604;</i>申请审核</button>
        {this.getGroupActorsList()}
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    selectedGroupUUID: state.getIn(['group', 'selectedGroupUUID']),
    groupInfo: state
      .getIn(['group', 'groups'])
      .find((group) => group.get('uuid')===state.getIn(['group', 'selectedGroupUUID']))
  })
)(GroupActor);
