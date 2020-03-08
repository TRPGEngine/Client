/**
 * 分页类型
 */
export interface PaginationType<T> {
  count: number;
  list: T[];
}
