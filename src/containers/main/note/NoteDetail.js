const React = require('react');
const { connect } = require('react-redux');
const TinyMCE = require('../../../components/TinyEditorComponent');
const { saveNote } = require('../../../redux/actions/note');

require('./NoteDetail.scss');

class NoteDetail extends React.Component {
  _handleSave(content) {
    let uuid = this.props.uuid;
    let title = this.refs.title.value;
    this.props.dispatch(saveNote(uuid, title, content));
  }

  render() {
    let note = this.props.note;
    return (
      <div className="note-detail">
        <div className="title">
          <input type="text" placeholder="笔记标题" ref="title" />
        </div>
        <TinyMCE
          id="note-editor"
          content={note.content}
          onEditorChange={() => {}}
          onEditorSave={content => this._handleSave(content)}
        />
      </div>
    )
  }
}
module.exports = connect()(NoteDetail);
