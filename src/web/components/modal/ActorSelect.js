const React = require('react');
const { connect } = require('react-redux');
const config = require('../../../../config/project.config.js');
const { showAlert, showModal } = require('../../../redux/actions/ui');
const TemplateSelect = require('../../containers/main/actors/TemplateSelect');

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
      let selectActorInfo = this.props.selfActors.find(a => a.get('uuid') === selectActorUUID);
      this.props.onSelect && this.props.onSelect(selectActorUUID, selectActorInfo && selectActorInfo.toJS());
    }else {
      this.props.showAlert('请选择人物卡');
    }
  }

  _handleActorCreate() {
    this.props.showModal(
      <TemplateSelect />
    );
  }

  render() {
    return (
      <div className="actor-select">
        <h3>请选择人物卡</h3>
        <div className="actor-list">
          {
            this.props.selfActors.size > 0 ? this.props.selfActors.map((item, index) => {
              let uuid = item.get('uuid');
              return (
                <div
                  key={`actor-item#${uuid}#${index}`}
                  className={'actor-item' + (this.state.selectActorUUID===uuid?' active':'')}
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
            }) : (
              <div className="no-actor">
                尚无人物卡, 现在去<span onClick={() => this._handleActorCreate()}>创建</span>
              </div>
            )
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
    showModal: (...args) => dispatch(showModal(...args)),
  })
)(ActorSelect);
