import MessageHandler from '../../../shared/components/MessageHandler';
import Default from '../../components/messageTypes/Default';
import Tip from '../../components/messageTypes/Tip';
import Card from '../../components/messageTypes/Card';
import File from '../../components/messageTypes/File';

MessageHandler.registerDefaultMessageHandler(Default);
MessageHandler.registerMessageHandler('tip', Tip);
MessageHandler.registerMessageHandler('card', Card);
MessageHandler.registerMessageHandler('file', File);

export default MessageHandler;
