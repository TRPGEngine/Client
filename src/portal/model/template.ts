import { request } from '@portal/utils/request';

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
 */
export const createTemplate = async (
  name: string,
  desc: string,
  layout: string
): Promise<ActorTemplate> => {
  const { data } = await request.post('/template/create', {
    name,
    desc,
    layout,
  });

  return data.template;
};
