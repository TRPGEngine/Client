import XMLBuilder from '@shared/components/layout/XMLBuilder';
import { TMemo } from '@shared/components/TMemo';
import React from 'react';

export const Previewer: React.FC<{
  xml: string;
}> = TMemo((props) => {
  const { xml } = props;

  return (
    <div>
      <XMLBuilder xml={xml} layoutType="edit" />
    </div>
  );
});
Previewer.displayName = 'Previewer';
