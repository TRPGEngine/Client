const emoji = require('node-emoji');
const emojis = [
  'grinning',
  'smiley',
  'wink',
  'sweat_smile',
  'yum',
  'sunglasses',
  'rage',
  'confounded',
  'flushed',
  'disappointed',
  'sob',
  'neutral_face',
  'innocent',
  'grin',
  'smirk',
  'scream',
  'sleeping',
  'flushed',
  'confused',
  'mask',
  'blush',
  'worried',
  'hushed',
  'heartbeat',
  'broken_heart',
  'crescent_moon',
  'star2',
  'sunny',
  'rainbow',
  'heart_eyes',
  'kissing_smiling_eyes',
  'lips',
  'rose',
  'rose',
  '+1',
];

const map = {};
for (let i in emojis) {
  const name = emojis[i];
  const code = emoji.get(name);
  map[code] = name;
}

export const emojiMap = map;
