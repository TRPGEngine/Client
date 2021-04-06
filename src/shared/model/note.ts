import { request } from '@shared/utils/request';

export interface NoteModelInfo {
  uuid: string;
  title: string;
  content: string;

  // 类型: src/web/components/editor/types.ts#TRPGEditorNode
  // 但是目前slate尚不能实现通用，先不引用
  data: any[];
}

/**
 * 获取笔记信息
 * @param noteUUID 笔记UUID
 */
export async function fetchNoteInfo(noteUUID: string): Promise<NoteModelInfo> {
  const { data } = await request.get(`/note/${noteUUID}/info`);

  return data.note;
}
