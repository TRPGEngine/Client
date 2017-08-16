const React = require('react');
const { connect } = require('react-redux');

const ConverseDetail = require('./ConverseDetail');

class ConverseList extends React.Component {
  render() {
    return (
      <ConverseDetail />
    )
  }
}

module.exports = connect(
  state => ({

  })
)(ConverseList);
