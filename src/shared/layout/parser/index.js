// TODO: 之后可能为了效率需要用htmlparser2进行底层修改。目前先用现成的
import convert from 'xml-js';

export default (parser = (xml) => {
  return convert.xml2js(xml, {
    compact: false,
    trim: true,
  });
});
