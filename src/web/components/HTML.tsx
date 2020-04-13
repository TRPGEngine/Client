import React, { useMemo } from 'react';
import xss from 'xss';
import { Parser } from 'html-to-react';
import { TMemo } from '@shared/components/TMemo';

const parser = new Parser();

interface Props {
  html: string;
}
const HTML: React.FC<Props> = TMemo((props) => {
  const el = useMemo(() => {
    const html = xss.filterXSS(props.html, { css: false }); // 防止xss
    return parser.parse(html);
  }, [props.html]);

  return <div>{el}</div>;
});
HTML.displayName = 'HTML';

export default HTML;
