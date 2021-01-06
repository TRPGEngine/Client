import { regPanel } from '@shared/components/panel/reg';
import { GroupPanelView } from '@shared/components/panel/GroupPanelView';
import { TextChannel } from './TextChannel';
import { NotePanel } from './NotePanel';
import { VoiceChannel } from './VoiceChannel';
import TLoadable from '../TLoadable';
import type { CommonPanelProps } from '@shared/components/panel/type';

const CalendarPanel = TLoadable<CommonPanelProps>(() =>
  import('./CalendarPanel').then((module) => module.CalendarPanel)
);

regPanel('channel', TextChannel);
regPanel('note', NotePanel);
regPanel('voicechannel', VoiceChannel);
regPanel('calendar', CalendarPanel);

export { GroupPanelView };
