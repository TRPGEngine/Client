const React = require('react');
const { connect } = require('react-redux')
const { showModal } = require('../../../redux/actions/ui');
const { setEditedTemplate } = require('../../../redux/actions/actor');
const TemplateEdit = require('./TemplateEdit');
const TemplateItem = require('../../../components/TemplateItem');

require('./ActorCreate.scss');

class ActorCreate extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleCreateTemplate() {
    this.props.setEditedTemplate({});
    this.props.showModal(<TemplateEdit />);
  }

  _handleEdit(item) {
    this.props.setEditedTemplate(item.toJS());
    this.props.showModal(<TemplateEdit />);
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
            {
              this.props.selfTemplate.map((item, index) => {
                return (
                  <TemplateItem
                    key={item.get('uuid')}
                    name={item.get('name')}
                    desc={item.get('desc')}
                    creator={this.props.username}
                    time={item.get('updateAt')}
                    onEdit={() => this._handleEdit(item)}
                  />
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    username: state.getIn(['user', 'info', 'username']),
    findingResult: state.getIn(['actor', 'findingResult']),
    selfTemplate: state.getIn(['actor', 'selfTemplate']),
  }),
  dispatch => ({
    showModal: (body) => dispatch(showModal(body)),
    setEditedTemplate: (obj) => dispatch(setEditedTemplate(obj)),
  })
)(ActorCreate)
