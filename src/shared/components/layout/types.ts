export type StateDataType = number | string | null | undefined;

export enum StateActionType {
  UpdateData = 'update_data',
  AddDefine = 'add_define',
  SetGlobal = 'set_global',
}
