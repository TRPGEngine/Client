import { request } from '@shared/utils/request';

interface ActorTemplate {
  uuid: string;
  name: string;
  desc: string;
  avatar: string;
  layout: string;
  built_in: boolean;
  is_public: boolean;
}

/**
 * 创建人物模板
 * @param name 模板名: 全局唯一
 * @param desc 模板描述
 * @param layout 模板布局信息
 */
export const createTemplate = async (
  name: string,
  desc: string,
  layout: string
): Promise<ActorTemplate> => {
  const { data } = await request.post('/actor/template/create', {
    name,
    desc,
    layout,
  });

  return data.template;
};
