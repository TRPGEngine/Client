import React from 'react';
import PropTypes from 'prop-types';

import './Checkbox.scss';

class Checkbox extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick() {
    this.props.onChange && this.props.onChange(!this.props.value);
  }

  render() {
    return (
      <div className="check-box" onClick={() => this.handleClick()}>
        <label className={this.props.value ? 'checked' : 'unchecked'} />
      </div>
    );
  }
}

Checkbox.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Checkbox;
