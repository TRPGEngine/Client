const React = require('react');
const { connect } = require('react-redux');
const TinyMCE = require('../../../components/TinyEditorComponent');
const { saveNote } = require('../../../../redux/actions/note');

require('./NoteDetail.scss');

class NoteDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
    };
  }

  componentDidMount() {
    this.setState({
      title: this.props.note.title,
      content: this.props.note.content,
    })
  }

  _handleSave() {
    let uuid = this.props.uuid;
    let title = this.state.title;
    let content = this.state.content;
    this.props.dispatch(saveNote(uuid, title, content));
  }

  render() {
    return (
      <div className="note-detail">
        <div className="title">
          <input
            type="text"
            placeholder="笔记标题"
            value={this.state.title}
            onChange={(e) => this.setState({title: e.target.value})}
          />
        </div>
        <TinyMCE
          id="note-editor"
          content={this.props.note.content}
          onEditorChange={(content) => this.setState({content: content})}
          onEditorSave={content => this._handleSave()}
        />
      </div>
    )
  }
}
module.exports = connect()(NoteDetail);
