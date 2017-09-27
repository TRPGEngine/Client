const React = require('react');
const { connect } = require('react-redux');
const at = require('trpg-actor-template');

require('./ActorCreate.scss');

class ActorCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchName: '',
      cells: [],
      profileDesc: '',
      profileAvatar: '',
    };
  }

  componentDidMount() {
    let info = this.props.selectedTemplate.get('info');
    let template = this.template = at.parse(info);
    console.log(template);
    this.setState({cells: template.getCells()});
  }

  _handleSave() {
    console.log('save', this.state.cells);
  }

  render() {
    return (
      <div className="actor-create">
        <div className="actor-create-header">
          <input placeholder="人物卡名" />
          <button onClick={() => this._handleSave()}>创建</button>
        </div>
        <div className="actor-create-body">
          <div className="actor-create-profile">
            <div className="avatar">
              <img />
            </div>
            <div className="desc">
              <textarea
                placeholder="人物卡描述/背景"
                value={this.state.profileDesc}
                onChange={(e) => this.setState({profileDesc: e.target.value})} />
            </div>
          </div>
            <div className="actor-create-property">
              {
                this.state.cells.map((item, index) => {
                  let isExpression = item.func === 'expression'
                  return (
                    <div key={item.uuid + '-' + index} className="actor-property-cell">
                      <div className="cell-name">{item.name}:</div>
                      <div className="cell-value">
                        <input
                          disabled={isExpression}
                          placeholder={isExpression?item.value:item.default}
                          value={item.value}
                          onChange={(e) => {
                            this.state.cells[index].value = e.target.value;
                            this.setState({cells: this.state.cells});
                          }}
                        />
                      </div>
                    </div>
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
    selectedTemplate: state.getIn(['actor', 'selectedTemplate'])
  })
)(ActorCreate);
