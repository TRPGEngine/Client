import { regPanel } from '@shared/components/panel/reg';
import { GroupPanelView } from '@shared/components/panel/GroupPanelView';
import { TextChannel } from './TextChannel';
import { NotePanel } from './NotePanel';

regPanel('channel', TextChannel);
regPanel('note', NotePanel);

export { GroupPanelView };
