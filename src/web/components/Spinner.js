import React from 'react';
require('./Spinner.scss');

class Spinner extends React.Component {
  render() {
    let visible = this.props.visible;
    if (visible === undefined) {
      visible = true;
    }
    return visible ? (
      <div className="single-spinner" style={this.props.style} />
    ) : null;
  }
}

export default Spinner;
