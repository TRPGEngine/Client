import MessageHandler from '../../../../shared/components/MessageHandler';
import Default from './Default';
import Tip from './Tip';
import Card from './Card';
import File from './File';

MessageHandler.registerDefaultMessageHandler(Default);
MessageHandler.registerMessageHandler('tip', Tip);
MessageHandler.registerMessageHandler('card', Card);
MessageHandler.registerMessageHandler('file', File);

export default MessageHandler;
