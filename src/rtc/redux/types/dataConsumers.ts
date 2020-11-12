export interface DataConsumersStateType {
  [dataConsumerId: string]: {
    id: string;
    sctpStreamParameters: {};
    label: string;
    protocol?: string;
  };
}
