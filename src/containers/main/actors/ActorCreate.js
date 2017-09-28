const React = require('react');
const { connect } = require('react-redux');
const at = require('trpg-actor-template');
const { showAlert } = require('../../../redux/actions/ui');
const { createActor } = require('../../../redux/actions/actor');
const ImageUploader = require('../../../components/ImageUploader');

require('./ActorCreate.scss');

class ActorCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cells: [],
      profileName: '',
      profileDesc: '',
      profileAvatar: '',
    };
  }

  componentDidMount() {
    this.template_uuid = this.props.selectedTemplate.get('uuid');
    let info = this.props.selectedTemplate.get('info');
    let template = this.template = at.parse(info);
    // console.log(template);
    template.eval();
    this.setState({cells: template.getCells()});
  }

  _handleSave() {
    console.log('save template', this.template);
    let name = this.state.profileName;
    let avatar = this.state.profileAvatar;
    let desc = this.state.profileDesc;
    let info = this.template.getData();
    let template_uuid = this.template_uuid;
    if(!name) {
      this.props.showAlert('人物名不能为空');
    }else {
      console.log('save data', {name, avatar, desc, info, template_uuid});
      this.props.showAlert({
        title: '创建人物',
        content: '是否要创建人物？数据如下:',
        type: 'alert',
        onConfirm: () => {
          this.props.createActor(name, avatar, desc, info, template_uuid)
        }
      })
    }
  }

  render() {
    return (
      <div className="actor-create">
        <div className="actor-create-header">
          <input
            placeholder="人物卡名"
            value={this.state.profileName}
            onChange={(e) => this.setState({profileName: e.target.value})} />
          <button onClick={() => this._handleSave()}>创建</button>
        </div>
        <div className="actor-create-body">
          <div className="actor-create-profile">
            <ImageUploader>
              <div className="avatar"></div>
            </ImageUploader>
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
                            try {
                              this.state.cells[index].value = e.target.value;
                              this.template.eval();
                            }finally {
                              this.setState({cells: this.state.cells});
                            }
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
  }),
  dispatch => ({
    showAlert: (msg) => {
      dispatch(showAlert(msg));
    },
    createActor: (name, avatar, desc, info, template_uuid) => {
      dispatch(createActor(name, avatar, desc, info, template_uuid));
    },
  })
)(ActorCreate);
