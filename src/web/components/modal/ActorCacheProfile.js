const React = require('react');
const { connect } = require('react-redux');
const ModalPanel = require('../ModalPanel.js');
const ActorProfile = require('./ActorProfile.js');

// 从缓存中获取actor信息的中间组件
class ActorCacheProfile extends React.Component {
  render() {
    let uuid = this.props.uuid;
    let actorcache = this.props.actorcache;
    return (
      <ModalPanel title="人物信息">
        <ActorProfile actor={actorcache.get(uuid) ? actorcache.get(uuid).toJS() : {}} />
      </ModalPanel>
    )
  }
}

module.exports = connect(
  state => ({
    actorcache: state.getIn(['cache', 'actor']),
  })
)(ActorCacheProfile);
