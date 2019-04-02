import React from 'react';
import parser from 'bbcode-to-react';
import { emojify } from './emoji';
import Image from '../../web/components/Image';

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

    return `<img ${this.renderer.htmlAttributes(attributes)} />`;
  }

  toReact() {
    const src = this.getContent(true);
    return (
      <Image
        src={src}
        width={this.params.width}
        height={this.params.height}
        role="chatimage"
      />
    );
  }
}

parser.registerTag('emoji', EmojiTag); // add new tag
parser.registerTag('img', ImageTag); // add new tag

export default parser;
