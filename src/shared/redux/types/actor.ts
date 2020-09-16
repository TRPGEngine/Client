export interface ActorBaseAttr {
  name: string;
  desc: string;
  avatar: string;
}

export interface ActorType extends ActorBaseAttr {
  id: number;
  uuid: string;
  template_uuid: string;
  info: ActorDataType;
  shared: boolean;
  fork_count: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  ownerId: number;
}

export interface ActorDataType {
  [key: string]: string;
}

export interface ActorTemplateType {
  uuid: string;
  name: string;
  desc: string;
  avatar: string | null;
  info: any;
  layout: string;
  built_in: boolean;
  is_public: boolean;

  updatedAt: string;
}

export type ActorState = {
  isFindingTemplate: boolean;
  suggestTemplate: ActorTemplateType[];
  findingResult: any[];
  currentEditedTemplate: {
    uuid: string;
    name: string;
    desc: string;
    avatar: string;
    info: string;
  };
  selfTemplate: any[];
  selectedTemplate: any;
  selfActors: ActorType[];
  selectedActorUUID: string;
};
