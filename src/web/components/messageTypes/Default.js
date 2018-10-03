const React = require('react');
const Base = require('./base');
const msgParser = require('../../../shared/utils/msgParser');

class Default extends Base {
  getContent() {
    const info = this.props.info || {};
    return (
      <pre className="bubble">{msgParser(info.message)}</pre>
    )
  }
}

module.exports = Default;
