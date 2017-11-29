const React = require('react');
const { emojify, getCodeList } = require('../utils/emoji');

require('./Emoticon.scss');

class Emoticon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectGroup: '',
    }
    this.emoji = getCodeList();
  }

  render() {
    return (
      <div
        className="emoticon"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        表情包
        <div className="items"></div>
        <div className="group">
          {Object.keys(this.emoji).map((groupName) => (
            <div
              key={"emoji-group#" + groupName}
              className={"group-selection" + (this.state.selectGroup===groupName?' active':'')}
              onClick={() => this.setState({selectGroup: groupName})}
            >
              {emojify(this.emoji[groupName][0])}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

module.exports = Emoticon;
