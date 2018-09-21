const React = require('react')
require('./Spinner.scss');

class Spinner extends React.Component {
  render() {
    let visible = this.props.visible;
    if(visible === undefined) {
      visible = true;
    }
    return visible ? (
      <div className="single-spinner" style={this.props.style}></div>
    ) : null
  }
}

module.exports = Spinner;
