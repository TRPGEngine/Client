const React = require('react');
const { connect } = require('react-redux');
const { addNote } = require('../../../redux/actions/note');
const moment = require('moment');

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
    let notes = this.props.noteList;
    let selectedNoteUUID = this.props.selectedNoteUUID;

    let content = notes?notes.map((item, index) => {
      item = item.toJS();

      let summary = item.content.replace(/<\/?.+?>/g,"").replace(/ /g,"");
      return (
        <div key={item.uuid} className={"note-item" + (selectedNoteUUID===item.uuid?" active":"")}>
          <div className="note-title">
            {item.title}
          </div>
          <div className="note-update-time">
            {moment(item.updated_At).fromNow()}
          </div>
          <div className="note-summary">
            {summary}
          </div>
        </div>
      )
    }):'';

    return content;
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
                <button className="addNote" onClick={() => {this.props.dispatch(addNote())}}>添加笔记</button>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}
module.exports = connect(
  state => ({
    selectedNoteUUID: state.getIn(['note', 'selectedNoteUUID']),
    noteList: state.getIn(['note', 'noteList']),
  })
)(NoteList);
