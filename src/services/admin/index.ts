import { request } from '@umijs/max';
import { IAdminInfos } from './typings';

/**
 * 获取所有管理员数据
 */
export async function getAdminList() {
  return request<API.Result<IAdminInfos[]>>('/api/admin', {
    method: 'GET',
  });
}
