import { request } from '@portal/utils/request';

export interface ActorItem {
  id: number;
  uuid: string;
  name: string;
  desc: string;
  avatar: string;
  template_uuid: string;
  info: { [key: string]: any };
}
export const fetchActorList = async (): Promise<ActorItem[]> => {
  const { data } = await request.get('/actor/list');

  if (data.result) {
    return data.list;
  } else {
    return [];
  }
};
