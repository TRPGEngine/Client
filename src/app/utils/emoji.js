import emoji from 'node-emoji';
import { getCodeList } from '../../shared/utils/emoji';
import _forEach from 'lodash/forEach';

const codeList = getCodeList();

export const emojiMap = _forEach(getCodeList(), (list, catalog, map) => {
  map[catalog] = list
    .filter((name) => emoji.hasEmoji(name))
    .map((name) => ({
      name,
      code: emoji.get(name),
    }));
});

export const emojiCatalog = [
  'people',
  'nature',
  'objects',
  'places',
  'symbols',
];
