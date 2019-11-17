import { request } from '@portal/utils/request';
import { getAbsolutePath } from '@shared/utils/file-helper';

export interface ActorItem {
  id: number;
  uuid: string;
  name: string;
  desc: string;
  avatar: string;
  template_uuid: string;
  info: { [key: string]: any };
}

export interface TemplateItem {
  uuid: string;
  name: string;
  desc: string;
  avatar: string;
  layout: string;
}

/**
 * 获取角色列表
 */
export const fetchActorList = async (): Promise<ActorItem[]> => {
  const { data } = await request.get('/actor/list');

  if (data.result) {
    return data.list.map((item: ActorItem) => ({
      ...item,
      avatar: getAbsolutePath(item.avatar),
    }));
  } else {
    return [];
  }
};

/**
 * 获取角色模板列表
 * @param page 页数
 */
export const fetchTemplateList = async (page = 1): Promise<TemplateItem[]> => {
  const { data } = await request.get('/actor/template/list');

  if (data.result) {
    return data.list.map((item: ActorItem) => ({
      ...item,
      avatar: getAbsolutePath(item.avatar),
    }));
  } else {
    return [];
  }
};

/**
 * 获取角色模板详情
 * @param uuid 模板UUID
 */
export const fetchTemplateInfo = async (
  uuid: string
): Promise<TemplateItem | null> => {
  const { data } = await request.get(`/actor/template/info/${uuid}`);

  if (data.result) {
    return data.template;
  } else {
    return null;
  }
};

export const createActor = async (
  templateUUID: string,
  actorInfo: { [key: string]: any }
): Promise<ActorItem> => {
  const { data } = await request.post('/actor/create', {
    templateUUID,
    actorInfo,
    name: actorInfo._name,
    desc: actorInfo._desc,
    avatar: actorInfo._avatar,
  });

  return data.actor;
};
