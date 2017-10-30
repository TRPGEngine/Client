const React = require('react');
const { connect } = require('react-redux');
const config = require('../../../../../config/project.config.js');

require('./GroupActorCheckSend.scss')

class GroupActorCheckSend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectActorUUID: '',
    }
  }

  render() {
    return (
      <div className="group-actor-check-send">
        <h3>请选择人物卡申请加入本团</h3>
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
          <button>提交申请</button>
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    selfActors: state.getIn(['actor', 'selfActors']),
    selectedGroupUUID: state.getIn(['group', 'selectedGroupUUID']),
  })
)(GroupActorCheckSend);
