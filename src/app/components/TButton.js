const React = require('react');
const Button = require('apsl-react-native-button');

class TButton extends React.Component {
  render() {
    return (
      <Button
        style={{borderWidth: 0, borderRadius: 2}}
        {...this.props}
      />
    )
  }
}

module.exports = TButton;
