const React = require('react');
const { connect } = require('react-redux');
const ModalPanel = require('../ModalPanel');
const { addFavoriteDice, updateFavoriteDice } = require('../../../redux/actions/settings');

require('./UserSettings.scss');

class UserSettings extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    // TODO: 把设置上传到服务器
  }

  _handleAddFavoriteDice() {
    // TODO
    console.log('add dice');
    this.props.dispatch(addFavoriteDice());
  }

  render() {
    return (
      <ModalPanel title="个人设置" className="user-settings">
        <p>常用骰子:</p>
        <div className="user-favorite-list">
          {this.props.userSettings.get('favoriteDice').map((item, index) => (
            <div key={'favorite-dice#'+index}>
              <input
                value={item.get('title')}
                onChange={e => this.props.dispatch(updateFavoriteDice(index, {title: e.target.value, value: item.get('value')}))}
                placeholder="标题"
              />
              <input
                value={item.get('value')}
                onChange={e => this.props.dispatch(updateFavoriteDice(index, {title: item.get('title'), value: e.target.value}))}
                placeholder="骰值"
              />
            </div>
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
