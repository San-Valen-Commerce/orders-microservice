export interface IMetadata {
  total: number;
  page: number;
  lastPage: number;
}

export interface ResposeAllSerializer<T> {
  data: T[];
  metadata: IMetadata;
}
