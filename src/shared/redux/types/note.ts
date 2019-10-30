import { Record, Map } from 'immutable';

export type NoteState = Record<{
  noteList: Map<string, any>;
  selectedNoteUUID: string;
  isSync: boolean;
  isSyncUUID: string;
}>;
