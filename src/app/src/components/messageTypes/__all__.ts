import MessageHandler from '@shared/components/MessageHandler';
import Default from './Default';
import Tip from './Tip';
import Card from './Card';
import File from './File';
import Loading from './Loading';
import { registerBBCodeTag } from '@src/shared/components/bbcode/parser';
import ImageTag from './bbcode/ImageTag';
import UrlTag from './bbcode/UrlTag';
import PlainText from './bbcode/PlainText';

registerBBCodeTag('_text', PlainText);
registerBBCodeTag('img', ImageTag);
registerBBCodeTag('url', UrlTag);

MessageHandler.registerDefaultMessageHandler(Default);
MessageHandler.registerMessageHandler('tip', Tip);
MessageHandler.registerMessageHandler('card', Card);
MessageHandler.registerMessageHandler('file', File);
MessageHandler.registerMessageHandler('loading', Loading);

export default MessageHandler;
