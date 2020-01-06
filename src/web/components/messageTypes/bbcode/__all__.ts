import BBCode from '@src/shared/components/bbcode';
import { registerBBCodeTag } from '@src/shared/components/bbcode/parser';
import ImageTag from './ImageTag';
// import UrlTag from './UrlTag';
import PlainText from './PlainText';

registerBBCodeTag('_text', PlainText);
registerBBCodeTag('img', ImageTag);
// registerBBCodeTag('url', UrlTag);

export default BBCode;
