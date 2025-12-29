import { request } from '@umijs/max';
import { ITypeInfos, ITypeParams } from './typings';

/**
 * 获取所有类型数据
 */
export async function getTypeListApi() {
  return request<API.Result<ITypeInfos[]>>('/api/type', {
    method: 'GET',
  });
}

/**
 * 添加类型
 */
export async function addTypeApi(data: ITypeParams) {
  return request<API.Result<string>>('/api/type', {
    method: 'POST',
    data,
  });
}

/**
 * 删除类型
 */
export async function deleteTypeApi(id: string) {
  return request<API.Result<string>>(`/api/type/${id}`, {
    method: 'DELETE',
  });
}
