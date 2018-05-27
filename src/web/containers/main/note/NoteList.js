const React = require('react');
const { connect } = require('react-redux');
const { addNote, switchNote } = require('../../../../redux/actions/note');
const moment = require('moment');
const ReactTooltip = require('react-tooltip');

const NoteDetail = require('./NoteDetail');

require('./NoteList.scss');

class NoteList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUUID: ''
    };
  }

  _handleClick(uuid) {
    this.props.dispatch(switchNote(uuid));
  }

  getNoteList() {
    let notes = this.props.noteList;
    let selectedNoteUUID = this.props.selectedNoteUUID;

    let content = notes?notes.toArray().map((item, index) => {
      item = item.toJS();

      let summary = item.content.replace(/<\/?.+?>/g,'').replace(/ /g,'');
      if(summary.length > 70) {
        summary = summary.slice(0, 70) + '...';
      }
      let uuid = item.uuid;
      return (
        <div
          key={uuid}
          className={'note-item' + (selectedNoteUUID===uuid?' active':'')}
          onClick={() => this._handleClick(uuid)}
        >
          <div className="note-title">
            {item.title}
          </div>
          <div className="note-update-time">
            {moment(item.updatedAt).fromNow()}
          </div>
          <div className="note-summary">
            {summary}
          </div>
        </div>
      )
    }):'';

    return content;
  }

  getNoteDetail() {
    const selectedNoteUUID = this.props.selectedNoteUUID;
    if(selectedNoteUUID) {
      let note = this.props.noteList.get(selectedNoteUUID);

      if(note) {
        return (
          <NoteDetail key={selectedNoteUUID} uuid={selectedNoteUUID} note={note.toJS()} />
        )
      }else {
        console.log('不存在该笔记');
      }
    }

    return (
      <div className="nocontent">
        <button className="addNote" onClick={() => this.props.dispatch(addNote())}>添加笔记</button>
      </div>
    )
  }

  render() {
    return (
      <div className="note">
        <div className="list">
          <div className="add-note" data-tip="添加笔记" onClick={() => this.props.dispatch(addNote())}>
            <ReactTooltip effect="solid"/>
            <i className="iconfont">&#xe604;</i>
          </div>
          <div className="items">
            {this.getNoteList()}
          </div>
        </div>
        <div className="detail">
          {this.getNoteDetail()}
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
