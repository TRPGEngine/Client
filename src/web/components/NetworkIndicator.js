const React = require('react');
const { connect } = require('react-redux');

require('./NetworkIndicator.scss');

class NetworkIndicator extends React.Component {
  render() {
    let network = this.props.network.toJS();
    let icon = '';
    let state = '';
    if (!!network.isOnline) {
      state = 'ok';
      icon = '&#xe620;';
    } else {
      if (network.tryReconnect) {
        state = 'loading';
        icon = '&#xeb0f;';
      } else {
        state = 'close';
        icon = '&#xe70c;';
      }
    }

    return (
      <div className={'network-indicator ' + state}>
        <div className="icon">
          <i className="iconfont" dangerouslySetInnerHTML={{ __html: icon }} />
        </div>
        <div className="msg">{network.msg}</div>
      </div>
    );
  }
}

module.exports = connect((state) => ({
  network: state.getIn(['ui', 'network']),
}))(NetworkIndicator);
