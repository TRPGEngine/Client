/* eslint-disable id-blacklist */
import { string, object } from 'yup';

/**
 * 创建FastForm的Schema
 *
 *
 */
export function createFastFormSchema(fieldMap: object) {
  return object().shape(fieldMap);
}

export const fieldSchema = {
  string,
};
