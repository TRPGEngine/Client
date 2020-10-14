import React, { useMemo } from 'react';
import { RenderElementProps, useSelected, useFocused } from 'slate-react';
import { TMemo } from '@shared/components/TMemo';
import _get from 'lodash/get';
import Image from '@web/components/Image';

interface EditorElementProps extends RenderElementProps {
  editorType: 'richtext' | 'inline';
}

export const SlateElement: React.FC<EditorElementProps> = (props) => {
  const { attributes, children, element, editorType } = props;

  switch (element.type) {
    case 'mention':
      return <MentionElement {...props} />;
    case 'image':
      return <ImageElement {...props} />;
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const MentionElement: React.FC<EditorElementProps> = TMemo((props) => {
  const { attributes, children, element } = props;
  const selected = useSelected();
  const focused = useFocused();

  return (
    <span
      {...attributes}
      contentEditable={false}
      style={{
        padding: '3px 3px 2px',
        margin: '0 1px',
        verticalAlign: 'baseline',
        display: 'inline-block',
        borderRadius: '4px',
        backgroundColor: '#eee',
        fontSize: '0.9em',
        boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
      }}
    >
      @{_get(element, 'data.text', '')}
      {children}
    </span>
  );
});
MentionElement.displayName = 'MentionElement';

const ImageElement: React.FC<EditorElementProps> = TMemo((props) => {
  const { attributes, children, element, editorType } = props;
  const selected = useSelected();
  const focused = useFocused();
  const style = useMemo(
    () => ({
      display: 'inline-block',
      maxWidth: '100%',
      maxHeight: editorType === 'inline' ? '4em' : undefined,
      boxShadow: selected && focused ? '0 0 0 3px #B4D5FF' : 'none',
      verticalAlign: 'bottom',
    }),
    [editorType, selected, focused]
  );

  return (
    <span {...attributes}>
      <Image src={String(element.url)} style={style} />
      {children}
    </span>
  );
});
ImageElement.displayName = 'ImageElement';
