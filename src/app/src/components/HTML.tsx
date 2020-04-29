import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import HTMLRender from 'react-native-render-html';
import { Dimensions } from 'react-native';
import xss from 'xss';

interface Props {
  html: string;
}
export const HTML: React.FC<Props> = TMemo((props) => {
  const html = useMemo(() => {
    return xss.filterXSS(props.html, { css: false }); // 防止xss
  }, [props.html]);

  return (
    <HTMLRender html={html} imagesMaxWidth={Dimensions.get('window').width} />
  );
});
HTML.displayName = 'HTML';
