import React from 'react';
import { RenderElementProps, useSelected, useFocused } from 'slate-react';
import { TMemo } from '@shared/components/TMemo';
import _get from 'lodash/get';

export const SlateElement: React.FC<RenderElementProps> = (props) => {
  const { attributes, children, element } = props;

  switch (element.type) {
    case 'mention':
      return <MentionElement {...props} />;
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

const MentionElement: React.FC<RenderElementProps> = TMemo((props) => {
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
