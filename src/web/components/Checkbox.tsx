import React from 'react';
import './Checkbox.scss';

interface Props {
  value: boolean;
  onChange: (value: boolean) => void;
}
class Checkbox extends React.PureComponent<Props> {
  get value() {
    return Boolean(this.props.value);
  }

  handleClick = () => {
    this.props.onChange && this.props.onChange(!this.value);
  };

  render() {
    return (
      <div className="check-box" onClick={this.handleClick}>
        <label className={this.value ? 'checked' : 'unchecked'} />
      </div>
    );
  }
}

export default Checkbox;
