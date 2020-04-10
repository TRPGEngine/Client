import { ImageToken, loadImageP, ImageTokenData } from './ImageToken';
import { GroupActorItem, fetchGroupActorDetail } from '@portal/model/group';
import { getAbsolutePath } from '@shared/utils/file-helper';
import _isNumber from 'lodash/isNumber';
import _isEmpty from 'lodash/isEmpty';
import config from '@shared/project.config';

interface ActorTokenData extends ImageTokenData {
  groupActorUUID: string;
}

/**
 * 获取人物卡的头像的图片地址
 * @param name 人物卡名
 * @param avatar 人物卡头像
 */
function getActorAvatarImage(name: string, avatar: string): string {
  if (_isEmpty(avatar)) {
    return getAbsolutePath(avatar);
  } else {
    return config.defaultImg.getUser(name);
  }
}

/**
 * NOTICE:
 * 该文件是TiledMap系统唯一对外部文件有依赖的文件
 */
export class ActorToken extends ImageToken {
  static TYPE = 'ActorToken';
  groupActorUUID: string;
  actorData: GroupActorItem;

  getData(): ActorTokenData {
    return {
      ...super.getData(),
      _type: ActorToken.TYPE,
      groupActorUUID: this.groupActorUUID,
    };
  }

  parseData(data: ActorTokenData) {
    this.groupActorUUID = data.groupActorUUID;
    super.parseData(data);

    this.promise
      .catch(() => {
        // 增加一层图片加载错误的fallback
        return loadImageP(config.defaultImg.getUser(name));
      })
      .then(() => {
        // 加载完图片后加载角色信息
        return fetchGroupActorDetail(this.groupActorUUID).then((data) => {
          // 加载信息完毕
          this.actorData = data;
        });
      });
  }

  buildPromise() {
    this._promise = fetchGroupActorDetail(this.groupActorUUID)
      .then((data) => {
        this.actorData = data;
        return data;
      })
      .then((data) => {
        const { name, avatar } = this.actorData;
        return loadImageP(getActorAvatarImage(name, avatar));
      })
      .catch(() => {
        // 增加一层图片加载错误的fallback
        return loadImageP(config.defaultImg.getUser(this.actorData.name));
      })
      .then((image) => {
        this.imageSize = {
          width: _isNumber(image.width) ? image.width : 100,
          height: _isNumber(image.height) ? image.height : 100,
        };
        this.loaded = true;
        this._image = image;
      });
  }
}
