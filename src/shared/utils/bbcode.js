const React = require('react');
const parser = require('bbcode-to-react');
const { emojify } = require('./emoji');
const Image = require('../../web/components/Image');

class EmojiTag extends parser.Tag {
  toReact() {
    let emojiCode = this.getContent(true);
    return emojify(`:${emojiCode}:`);
  }
}

// 重写img标签
class ImageTag extends parser.Tag {
  toHTML() {
    const attributes = {
      src: this.renderer.strip(this.getContent(true)),
    };

    if (this.params.width) {
      attributes.width = this.params.width;
    }

    if (this.params.height) {
      attributes.height = this.params.height;
    }

    return `<img ${(this.renderer.htmlAttributes(attributes))} />`;
  }

  toReact() {
    const src = this.getContent(true);
    return (
      <Image
        src={src}
        width={this.params.width}
        height={this.params.height}
      />
    );
  }
}

parser.registerTag('emoji', EmojiTag); // add new tag
parser.registerTag('img', ImageTag); // add new tag

module.exports = parser;
