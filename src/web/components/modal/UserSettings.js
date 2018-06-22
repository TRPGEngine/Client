const React = require('react');
const { connect } = require('react-redux');
const ModalPanel = require('../ModalPanel');

require('./UserSettings.scss');

class UserSettings extends React.Component {
  componentWillUnmount() {
    // TODO: 把设置上传到服务器
  }

  _handleAddFavoriteDice() {
    // TODO
    console.log('add dice');
  }

  render() {
    return (
      <ModalPanel title="个人设置" className="user-settings">
        <p>常用骰子:</p>
        <div className="user-favorite-list">
          {this.props.userSettings.get('favoriteDice', []).map((item, index) => (
            <div key={'favorite-dice#'+index}>{item.get('title')}{item.get('value')}</div>
          ))}
          <button onClick={() => this._handleAddFavoriteDice()}><i className="iconfont">&#xe604;</i></button>
        </div>
      </ModalPanel>
    )
  }
}

module.exports = connect(
  state => ({
    userSettings: state.getIn(['settings', 'user']),
  })
)(UserSettings);
