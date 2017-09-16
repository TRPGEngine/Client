const React = require('react');
const { connect } = require('react-redux')
const { showModal } = require('../../../redux/actions/ui');
const TemplateCell = require('../../../components/TemplateCell');

require('./TemplateCreate.scss');

class TemplateCreate extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleBack() {
    const ActorCreate = require('./ActorCreate');
    this.props.showModal(<ActorCreate />);
  }

  render()　{
    return (
      <div className="template-create">
        <div className="profile-panel">
          <div className="header">
            <button onClick={() => this._handleBack()}>&lt;返回</button>
            <input placeholder="模板名" />
            <button>保存</button>
          </div>
          <div className="desc">
            <textarea placeholder="模板描述" rows="4" cols="60"></textarea>
          </div>
          <div className="property-list">
            <TemplateCell name="力量" value="20" />
            <TemplateCell name="敏捷" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
            <TemplateCell name="体质" value="20"/>
          </div>
        </div>
        <div className="inspect-panel">

        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    findingResult: state.getIn(['user', 'actor', 'findingResult']),
  }),
  dispatch => ({
    showModal: (body) => dispatch(showModal(body))
  })
)(TemplateCreate)
