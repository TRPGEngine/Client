const React = require('react');
const { connect } = require('react-redux');

const NoteDetail = require('./NoteDetail');

require('./NoteList.scss');

class NoteList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUUID: ''
    };
  }

  getNoteList() {
    let notes = [];
    return notes;
  }

  render() {
    return (
      <div className="note">
        <div className="list">
          {this.getNoteList()}
        </div>
        <div className="detail">
          {
            this.state.selectedUUID
            ? (
              <NoteDetail />
            )
            : (
              <div className="nocontent">
                <button className="addNote">添加笔记</button>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}
module.exports = NoteList;
