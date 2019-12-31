import React from 'react';
import { connect } from 'react-redux';
import { addNote, switchNote } from '@shared/redux/actions/note';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import Spinner from '../../../components/Spinner';
import { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';
import NoteDetail from './NoteDetail';
import _values from 'lodash/values';
import _orderBy from 'lodash/orderBy';

import './NoteList.scss';

interface Props extends TRPGDispatchProp {
  selectedNoteUUID: string;
  noteList: any;
  isNoteSync: boolean;
  isNoteSyncUUID: string;
}
class NoteList extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      selectedUUID: '',
    };
  }

  handleClick(uuid) {
    this.props.dispatch(switchNote(uuid));
  }

  getNoteList() {
    let notes = this.props.noteList;
    let selectedNoteUUID = this.props.selectedNoteUUID;

    let content = notes
      ? _orderBy(_values(notes), 'updatedAt', 'desc').map((item, index) => {
          let summary = item.content.replace(/<\/?.+?>/g, '').replace(/ /g, '');
          if (summary.length > 70) {
            summary = summary.slice(0, 70) + '...';
          }
          let uuid = item.uuid;
          return (
            <div
              key={uuid}
              className={
                'note-item' + (selectedNoteUUID === uuid ? ' active' : '')
              }
              onClick={() => this.handleClick(uuid)}
            >
              <div className="note-title">
                <span>{item.title}</span>
                <Spinner
                  visible={
                    this.props.isNoteSync && uuid === this.props.isNoteSyncUUID
                  }
                />
              </div>

              <div className="note-update-time">
                {moment(item.updatedAt).fromNow()}
              </div>
              <div className="note-summary">{summary}</div>
            </div>
          );
        })
      : '';

    return content;
  }

  getNoteDetail() {
    const selectedNoteUUID = this.props.selectedNoteUUID;
    if (selectedNoteUUID) {
      let note = this.props.noteList[selectedNoteUUID];

      if (note) {
        return (
          <NoteDetail
            key={selectedNoteUUID}
            uuid={selectedNoteUUID}
            note={note}
          />
        );
      } else {
        console.log('不存在该笔记');
      }
    }

    return (
      <div className="nocontent">
        <button
          className="addNote"
          onClick={() => this.props.dispatch(addNote())}
        >
          添加笔记
        </button>
      </div>
    );
  }

  render() {
    return (
      <div className="note">
        <div className="list">
          <div
            className="add-note"
            data-tip="添加笔记"
            onClick={() => this.props.dispatch(addNote())}
          >
            <ReactTooltip effect="solid" />
            <i className="iconfont">&#xe604;</i>
          </div>
          <div className="items">{this.getNoteList()}</div>
        </div>
        <div className="detail">{this.getNoteDetail()}</div>
      </div>
    );
  }
}
export default connect((state: TRPGState) => ({
  selectedNoteUUID: state.note.selectedNoteUUID,
  noteList: state.note.noteList,
  isNoteSync: state.note.isSync,
  isNoteSyncUUID: state.note.isSyncUUID,
}))(NoteList);
