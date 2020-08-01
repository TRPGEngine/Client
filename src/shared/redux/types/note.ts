import type { Node } from 'slate';

export interface NoteInfo {
  uuid: string;
  title: string;
  data: Node[]; // 笔记内容 为slate的结构化数据
  isSync: boolean;
  updatedAt: number; // 最后编辑的时间戳
}

export interface NoteState {
  list: NoteInfo[];

  /**
   * @deprecated 应当使用list代替
   */
  noteList: { [uuid: string]: any };
  selectedNoteUUID: string;
  isSync: boolean;
  isSyncUUID: string;
}
