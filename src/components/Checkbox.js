const React = require('react');

require('./Checkbox.scss');

class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: props.default || false
    }
  }

  _handleClick() {
    let isChecked = !this.state.isChecked
    this.setState({isChecked});
    this.props.onChange && this.props.onChange(isChecked);
  }

  render() {
    return (
      <div className="check-box" onClick={() => this._handleClick()}>
        <label className={this.state.isChecked?'checked':'unchecked'}></label>
      </div>
    )
  }
}

module.exports = Checkbox;
