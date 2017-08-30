const React = require('react');
const { connect } = require('react-redux');
const TinyMCE = require('../../../components/TinyEditorComponent');
const { saveNote } = require('../../../redux/actions/note');

require('./NoteDetail.scss');

class NoteDetail extends React.Component {
  render() {
    const { note, uuid } = this.props;
    return (
      <div className="note-detail">
        <TinyMCE
          id="note-editor"
          content={note.content}
          onEditorChange={() => {}}
          onEditorSave={content => this.props.dispatch(saveNote(uuid, content))}
        />
      </div>
    )
  }
}
module.exports = connect()(NoteDetail);
