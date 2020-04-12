import _isNumber from 'lodash/isNumber';
import { Size, TokenData } from '../../core/types';
import { DrawContext } from '../../core/render';
import { BaseToken } from './BaseToken';

export function loadImageP(imageUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      console.error('[ImageToken]', '图片加载失败:', imageUrl);

      reject();
    };
  });
}

export interface ImageTokenData extends TokenData {
  imageSrc: string;
}

export class ImageToken extends BaseToken {
  static TYPE = 'ImageToken';

  imageSize: Size; // 图片的实际大小
  imageSrc: string; // 图片路径
  protected _image: HTMLImageElement;
  protected _promise: Promise<void>;
  loaded: boolean = false;

  get promise() {
    return this._promise;
  }

  async prepare(): Promise<void> {
    await Promise.resolve(this._promise);
  }

  draw(ctx: DrawContext) {
    if (!this.loaded) {
      return;
    }

    const { gridSize } = ctx;

    ctx.render.canvas.drawImage(
      this._image,
      this.gridPosition.x * gridSize.width,
      this.gridPosition.y * gridSize.height,
      this.gridAreaSize.width * gridSize.width,
      this.gridAreaSize.height * gridSize.height
    );
  }

  getData(): ImageTokenData {
    return {
      ...super.getData(),
      _type: ImageToken.TYPE,
      imageSrc: this.imageSrc,
    };
  }

  parseData(data: ImageTokenData) {
    super.parseData(data);
    this.imageSrc = data.imageSrc;

    this.buildPromise();
  }

  buildPromise() {
    this._promise = loadImageP(this.imageSrc).then((image) => {
      this.imageSize = {
        width: _isNumber(image.width) ? image.width : 100,
        height: _isNumber(image.height) ? image.height : 100,
      };
      this.loaded = true;
      this._image = image;
    });
  }
}
