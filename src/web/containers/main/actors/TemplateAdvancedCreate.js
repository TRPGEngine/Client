const React = require('react');
const ModalPanel = require('../../../components/ModalPanel');

require('./TemplateAdvancedCreate.scss');

class TemplateAdvancedCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      templateStr: ''
    }
  }

  _handleCreateTemplate() {
    console.log('TODO');
    console.log(this.state.templateStr);
  }

  getActions() {
    return (
      <div>
       <button onClick={() => this._handleCreateTemplate()}>创建模板</button>
      </div>
    )
  }

  render() {
    return (
      <ModalPanel className="template-advanced-create" title={'进阶模板导入'} actions={this.getActions()}>
        <p>模板内容:</p>
        <textarea value={this.state.templateStr} onChange={(e) => this.setState({templateStr: e.target.value})}></textarea>
      </ModalPanel>
    )
  }
}

module.exports = TemplateAdvancedCreate;
