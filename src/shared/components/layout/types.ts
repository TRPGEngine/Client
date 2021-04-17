export type StateDataType = number | string | null | undefined;

export enum StateActionType {
  UpdateData = 'update_data',
  UpdateAllData = 'update_all_data',
  AddDefine = 'add_define',
  SetGlobal = 'set_global',
}

/**
 * 预渲染的Tag
 */
export const preRenderTags = ['Static'];
