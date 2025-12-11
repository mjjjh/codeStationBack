import { request } from '@umijs/max';
import { IAdminInfos } from './typings';

/**
 * 获取所有管理员数据
 */
export async function getAdminListApi() {
  return request<API.Result<IAdminInfos[]>>('/api/admin', {
    method: 'GET',
  });
}

/**
 * 删除管理员
 */
export async function deleteAdminApi(id: string) {
  return request<API.Result<string>>(`/api/admin/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 修改管理员
 */
export async function updateAdminApi(id: string, data: Partial<IAdminInfos>) {
  return request<API.Result<string>>(`/api/admin/${id}`, {
    method: 'PATCH',
    data,
  });
}

/**
 * 添加管理员
 */
export async function addAdminApi(data: IAdminInfos) {
  return request<API.Result<string>>(`/api/admin`, {
    method: 'POST',
    data,
  });
}

/**
 * 校验管理员账号是否存在
 */
export async function checkAdminLoginIdApi(loginId: string) {
  return request<API.Result<boolean>>(`/api/admin/adminIsExist/${loginId}`, {
    method: 'GET',
  });
}
