import MessageHandler from '@shared/components/message/MessageHandler';
import Default from './Default';
import Tip from './Tip';
import Card from './Card';
import File from './File';
import Loading from './Loading';
// import './bbcode/__all__';

MessageHandler.registerDefaultMessageHandler(Default);
MessageHandler.registerMessageHandler('tip', Tip);
MessageHandler.registerMessageHandler('card', Card);
MessageHandler.registerMessageHandler('file', File);
MessageHandler.registerMessageHandler('loading', Loading);

export default MessageHandler;
