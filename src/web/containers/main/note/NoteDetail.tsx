import React from 'react';
import { connect } from 'react-redux';
import { saveNote } from '../../../../shared/redux/actions/note';
import TLoadable from '@web/components/TLoadable';
import type { TRPGDispatchProp } from '@redux/types/__all__';

import './NoteDetail.scss';

const NoteEditor = TLoadable(() => import('../../../components/NoteEditor'));

interface Props extends TRPGDispatchProp {
  uuid: string;
  note: {
    title: string;
    content: string;
  };
}
interface State {
  title: string;
  content: string;
}
class NoteDetail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      title: props.note.title,
      content: props.note.content,
    };
  }

  handleSave = () => {
    console.log('笔记本存储中....');
    const uuid = this.props.uuid;
    const title = this.state.title;
    const content = this.state.content;
    this.props.dispatch(saveNote(uuid, title, content));
  };

  render() {
    return (
      <div className="note-detail">
        <div className="title">
          <input
            type="text"
            placeholder="笔记标题"
            value={this.state.title}
            onChange={(e) => this.setState({ title: e.target.value })}
            onBlur={this.handleSave}
          />
        </div>
        <NoteEditor
          value={this.state.content}
          onChange={(content) => this.setState({ content })}
          onSave={() => this.handleSave()}
        />
      </div>
    );
  }
}
export default connect()(NoteDetail);
