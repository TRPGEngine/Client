const parser = require('bbcode-to-react');
const { emojify } = require('./emoji');

class EmojiTag extends parser.Tag {
  toReact() {
    let emojiCode = this.getContent(true);
    return emojify(`:${emojiCode}:`);
  }
}

parser.registerTag('emoji', EmojiTag); // add new tag

module.exports = parser;
