import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { RichTextEditor } from '@web/components/editor/RichTextEditor';

 const EditorDemo: React.FC = TMemo(() => {
  return <RichTextEditor />;
});
EditorDemo.displayName = 'EditorDemo';

export default EditorDemo
