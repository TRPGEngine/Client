const React = require('react');
const PropTypes = require('prop-types');

require('./ModalPanel.scss');

class ModalPanel extends React.Component {
  render() {
    return (
      <div className={'modal-panel ' + (this.props.className || '')}>
        <div className="head">{this.props.title}</div>
        <div className="body">{this.props.children}</div>
        {this.props.actions ? (
          <div className="foot">{this.props.actions}</div>
        ) : null}
      </div>
    );
  }
}

ModalPanel.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  actions: PropTypes.element,
};

module.exports = ModalPanel;
