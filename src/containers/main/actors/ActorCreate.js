const React = require('react');
const { connect } = require('react-redux')
const { showModal } = require('../../../redux/actions/ui');
const TemplateCreate = require('./TemplateCreate');
const TemplateItem = require('../../../components/TemplateItem');

require('./ActorCreate.scss');

class ActorCreate extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleCreateTemplate() {
    this.props.showModal(<TemplateCreate />);
  }

  render()　{
    return (
      <div className="actor-create">
        <div className="header">
          <input type="text" placeholder="输入要搜索的模板名" />
          <button>
            <i className="iconfont">&#xe60a;</i>搜索
          </button>
          <button onClick={() => this._handleCreateTemplate()}>
            <i className="iconfont">&#xe604;</i>创建新的人物模板
          </button>
        </div>
        <div className="body">
          <div className="search-result">
            <div className="no-result">暂无搜索结果...</div>
          </div>
          <div className="self-template">
            <TemplateItem />
            <TemplateItem />
            <TemplateItem />
            <TemplateItem />
            <TemplateItem />
            <TemplateItem />
            <TemplateItem />
          </div>
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
)(ActorCreate)
