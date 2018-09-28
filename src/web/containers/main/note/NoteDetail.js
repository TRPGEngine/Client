const React = require('react');
const { connect } = require('react-redux');
const NoteEditor = require('../../../components/NoteEditor');
const { saveNote } = require('../../../../redux/actions/note');

require('./NoteDetail.scss');

class NoteDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.note.title,
      content: props.note.content,
    };
  }

  _handleSave() {
    console.log('笔记本存储中....');
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
            onBlur={() => this._handleSave()}
          />
        </div>
        <NoteEditor
          value={this.state.content}
          onChange={(content) => this.setState({content})}
          onSave={() => this._handleSave()}
        />
      </div>
    )
  }
}
module.exports = connect()(NoteDetail);
