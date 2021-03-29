import type { GroupPanelType } from '@shared/types/panel';
import { getGroupPanelIcon } from '../utils';

describe('getGroupPanelIcon', () => {
  test.each<[GroupPanelType]>([
    ['channel'],
    ['voicechannel'],
    ['note'],
    ['website'],
    ['calendar'],
  ])('%s', (type) => {
    expect(getGroupPanelIcon(type)).toMatchSnapshot();
  });
});
