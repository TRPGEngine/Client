const React = require('react');
const {
  Text,
} = require('react-native');
const Base = require('./Base');

class Default extends Base {
  getContent() {
    const info = this.props.info || {};
    return (
      <Text>{info.message}</Text>
    )
  }
}

module.exports = Default;
