const React = require('react');
const { connect } = require('react-redux')
const { showModal } = require('../../../redux/actions/ui');

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
        <div className="header">
          <button onClick={() => this._handleBack()}>返回</button>
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
