import { regPanel } from '@shared/components/panel/reg';
import { GroupPanelView } from '@shared/components/panel/GroupPanelView';
import { TextChannel } from './TextChannel';
import { NotePanel } from './NotePanel';
import { VoiceChannel } from './VoiceChannel';

regPanel('channel', TextChannel);
regPanel('note', NotePanel);
regPanel('voice', VoiceChannel);

export { GroupPanelView };
