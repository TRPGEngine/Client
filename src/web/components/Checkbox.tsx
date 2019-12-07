import React from 'react';
import './Checkbox.scss';

interface Props {
  value: boolean;
  onChange: (value: boolean) => void;
}
class Checkbox extends React.Component<Props> {
  handleClick = () => {
    this.props.onChange && this.props.onChange(!this.props.value);
  };

  render() {
    return (
      <div className="check-box" onClick={() => this.handleClick()}>
        <label className={this.props.value ? 'checked' : 'unchecked'} />
      </div>
    );
  }
}

export default Checkbox;
