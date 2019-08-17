export interface ActorType {
  id: number;
  uuid: string;
  name: string;
  desc: string;
  avatar: string;
  info: ActorDataType;
  template_uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  ownerId: number;
}

export interface ActorDataType {
  [key: string]: string;
}
