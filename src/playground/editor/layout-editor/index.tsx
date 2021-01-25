import React from 'react';
import { EditorMain } from './EditorMain';
import './cups/reg';

export const ActorLayoutEditor: React.FC = React.memo(() => {
  return (
    <div>
      <EditorMain />
    </div>
  );
});
ActorLayoutEditor.displayName = 'ActorLayoutEditor';
