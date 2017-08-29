const React = require('react');
const { connect } = require('react-redux');
const TinyMCE = require('../../../components/TinyEditorComponent');

require('./NoteDetail.scss');

class NoteDetail extends React.Component {
  render() {
    return (
      <div className="note-detail">
        <TinyMCE
          id="note-editor"
          onEditorChange={content => console.log(content)}
        />
      </div>
    )
  }
}
module.exports = NoteDetail;
