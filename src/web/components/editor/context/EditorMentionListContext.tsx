import React from 'react';

export interface EditorMentionListItem {
  text: string;
  [other: string]: any;
}
export const EditorMentionListContext = React.createContext<
  EditorMentionListItem[]
>([]);
EditorMentionListContext.displayName = 'EditorMentionListContext';
