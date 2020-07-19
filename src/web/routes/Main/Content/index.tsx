import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { MainContentType } from './type';

interface MainContentProps {
  type: MainContentType;
}
export const MainContent: React.FC<MainContentProps> = TMemo((props) => {
  const { type } = props;

  if (type === 'init') {
    return <div>init</div>;
  } else if (type === 'personal') {
    return <div>personal</div>;
  } else if (type === 'group') {
    return <div>group</div>;
  }
});
MainContent.displayName = 'MainContent';
