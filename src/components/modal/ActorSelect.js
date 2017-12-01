const React = require('react');
const { connect } = require('react-redux');
const config = require('../../../config/project.config.js');
const { showAlert } = require('../../redux/actions/ui');

require('./ActorSelect.scss')

class ActorSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectActorUUID: '',
    }
  }

  _handleSelect() {
    let selectActorUUID = this.state.selectActorUUID;
    if(selectActorUUID) {
      console.log('[人物卡列表]选择了' + selectActorUUID);
      this.props.onSelect && this.props.onSelect(selectActorUUID);
    }else {
      this.props.showAlert('请选择人物卡');
    }
  }

  render() {
    return (
      <div className="actor-select">
        <h3>请选择人物卡</h3>
        <div className="actor-list">
          {
            this.props.selfActors.map((item, index) => {
              let uuid = item.get('uuid');
              return (
                <div
                  key={`actor-item#${uuid}#${index}`}
                  className={"actor-item" + (this.state.selectActorUUID===uuid?' active':'')}
                  onClick={() => this.setState({selectActorUUID: uuid})}
                >
                  <div className="actor-avatar" style={{backgroundImage: `url(${item.get('avatar') || config.defaultImg.actor})`}}></div>
                  <div className="actor-info">
                    <div className="actor-name">{item.get('name')}</div>
                    <div className="actor-desc">{item.get('desc')}</div>
                  </div>
                  <div className="actor-extra">
                    <i className="iconfont">&#xe620;</i>
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className="action">
          <button onClick={() => this._handleSelect()}>确定</button>
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    selfActors: state.getIn(['actor', 'selfActors']),
  }),
  dispatch => ({
    showAlert: (...args) => dispatch(showAlert(...args)),
  })
)(ActorSelect);
