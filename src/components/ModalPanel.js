const React = require('react');

require('./ModalPanel.scss');

class ModalPanel extends React.Component {
  render() {
    return (
      <div className="modal-panel">
        <div className="head">
          {this.props.title}
        </div>
        <div className="body">
          {this.props.children}
        </div>
        {
          this.props.actions ? (
            <div className="foot">
              {this.props.actions}
            </div>
          ) : null
        }

      </div>
    )
  }
}

module.exports = ModalPanel;
