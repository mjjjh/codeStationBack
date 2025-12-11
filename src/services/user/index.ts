import { request } from '@umijs/max';
import { IResUserInfos, IUserInfos, IUserParams } from './typings';
/**
 * 分页查找用户信息
 */
export async function getUserListByPageApi(params: Partial<IUserParams>) {
  return request<API.Result<IResUserInfos>>('/api/user', {
    method: 'GET',
    params,
  });
}

/**
 * 添加用户
 */
export async function addUserApi(data: IUserInfos, type = 'background') {
  return request<API.Result<string>>('/api/user', {
    method: 'POST',
    data: { ...data, type },
  });
}

/**
 * 删除用户
 */
export async function deleteUserApi(id: string) {
  return request<API.Result<string>>(`/api/user/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 修改用户
 */
export async function updateUserApi(id: string, data: Partial<IUserInfos>) {
  return request<API.Result<string>>(`/api/user/${id}`, {
    method: 'PATCH',
    data,
  });
}
