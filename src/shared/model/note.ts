import { request } from '@shared/utils/request';

export interface NoteModelInfo {
  uuid: string;
  title: string;
  content: string;
  data: object;
}

/**
 * 获取笔记信息
 * @param noteUUID 笔记UUID
 */
export async function fetchNoteInfo(noteUUID: string): Promise<NoteModelInfo> {
  const { data } = await request.get(`/note/${noteUUID}/info`);

  return data.note;
}
