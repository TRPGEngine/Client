import { Position, Size } from '../core/types';
import { DrawContext } from '../core/render';
import _isNumber from 'lodash/isNumber';

export class Token {
  position: Position = { x: 0, y: 0 };

  constructor(public name: string) {}

  render(ctx: DrawContext) {
    throw new Error('Should be Implement');
  }
}

export class ImageToken extends Token {
  size: Size;

  constructor(name: string, public image: CanvasImageSource) {
    super(name);

    this.size = {
      width: _isNumber(image.width) ? image.width : 100,
      height: _isNumber(image.height) ? image.height : 100,
    };
  }

  render(ctx: DrawContext) {
    ctx.render.canvas.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
  }
}
