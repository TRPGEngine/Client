import { ImageToken, loadImageP } from './ImageToken';
import { GroupActorItem } from '@portal/model/group';
import { getAbsolutePath } from '@shared/utils/file-helper';
import _isEmpty from 'lodash/isEmpty';
import config from '@shared/project.config';
import { TokenData } from '../../core/types';

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
 * 该文件是TiledMap系统唯一对外部文件有依赖的文件
 */
export class ActorToken extends ImageToken {
  static TYPE = 'ActorToken';
  actorData: GroupActorItem;

  constructor(actorData: GroupActorItem, id?: string) {
    const { name, avatar } = actorData;
    const imageSrc = getActorAvatarImage(name, avatar);
    super(imageSrc, id);

    this.actorData = actorData;
    this.promise.catch(() => {
      // 增加一层图片加载错误的fallback
      return loadImageP(config.defaultImg.getUser(name));
    });
  }

  getData(): TokenData {
    return {
      ...super.getData(),
      actor: this.actorData,
    };
  }

  parseData(data: TokenData) {
    super.parseData(data);
    this.actorData = data.actor;
  }
}
