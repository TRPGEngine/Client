import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import HTMLRender from 'react-native-render-html';
import { Dimensions } from 'react-native';

interface Props {
  html: string;
}
export const HTML: React.FC<Props> = TMemo((props) => {
  return (
    <HTMLRender
      html={props.html}
      imagesMaxWidth={Dimensions.get('window').width}
    />
  );
});
HTML.displayName = 'HTML';
