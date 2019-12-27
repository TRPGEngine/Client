export type NoteState = {
  noteList: { [uuid: string]: any };
  selectedNoteUUID: string;
  isSync: boolean;
  isSyncUUID: string;
};
