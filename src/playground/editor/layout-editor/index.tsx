import React from 'react';
import { EditorMain } from './EditorMain';

export const ActorLayoutEditor: React.FC = React.memo(() => {
  return (
    <div>
      <EditorMain />
    </div>
  );
});
ActorLayoutEditor.displayName = 'ActorLayoutEditor';
