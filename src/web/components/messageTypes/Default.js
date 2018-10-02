const Base = require('./base');

class Default extends Base {
  getContent() {
    const data = this.props.data;
    return (
      <pre>{data.content}</pre>
    )
  }
}

module.exports = Default;
