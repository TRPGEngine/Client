import { useTRPGSelector } from '@redux/hooks/useTRPGSelector';
import type { NoteInfo } from '@redux/types/note';

/**
 * 笔记详情信息
 * @param noteUUID 笔记UUID
 */
export function useNoteInfo(noteUUID: string): NoteInfo | undefined {
  const noteInfo = useTRPGSelector((state) =>
    state.note.list.find((n) => n.uuid === noteUUID)
  );

  return noteInfo;
}
