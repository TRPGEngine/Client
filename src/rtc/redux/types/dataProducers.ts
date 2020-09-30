export interface DataProducersStateType {
  [dataProducerId: string]: {
    id: string;
    sctpStreamParameters: {};
    label: string;
    protocol: string;
  };
}
