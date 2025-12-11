import { request } from '@umijs/max';
import { ITypeInfos } from './typings';

/**
 * 获取所有类型数据
 */
export async function getTypeListApi() {
  return request<API.Result<ITypeInfos[]>>('/api/type', {
    method: 'GET',
  });
}
