const React = require('react');
const Button = require('apsl-react-native-button');

class TButton extends React.Component {
  render() {
    return (
      <Button
        textStyle={{color: 'white'}}
        {...this.props}
        style={[styles.default, styles[this.props.type], this.props.style]}
      />
    )
  }
}

const styles = {
  'default': {
    borderWidth: 0,
    borderRadius: 2,
    backgroundColor: '#705949',
  },
  error: {
    backgroundColor: '#ff4400',
  },
}

module.exports = TButton;
