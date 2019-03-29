// TODO: 之后可能为了效率需要用htmlparser2进行底层修改。目前先用现成的
import convert from 'xml-js';

const parser = (xml) => {
  console.time('xml解析用时');
  const js = convert.xml2js(xml, {
    compact: false,
    trim: true,
  });
  console.timeEnd('xml解析用时');
  return js;
};

export default parser;
