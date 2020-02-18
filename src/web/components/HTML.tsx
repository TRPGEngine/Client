import React, { useMemo } from 'react';
import xss from 'xss';

interface Props {
  html: string;
}
const HTML: React.FC<Props> = React.memo((props) => {
  const html = useMemo(() => xss.filterXSS(props.html, { css: false }), [
    props.html,
  ]);

  return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
});

export default HTML;
