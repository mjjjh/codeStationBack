import { request } from '@umijs/max';
import { IIssueInfos, IIssueParams, IResIssueInfos } from './typings';
/**
 * 分页查找问答信息
 */
export async function getIssueListByPageApi(params: Partial<IIssueParams>) {
  return request<API.Result<IResIssueInfos>>('/api/issue', {
    method: 'GET',
    params,
  });
}

/**
 * 删除问答
 */
export async function deleteIssueApi(id: string) {
  return request<API.Result<string>>(`/api/issue/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 修改问答
 */
export async function updateIssueApi(id: string, params: Partial<IIssueInfos>) {
  return request<API.Result<string>>(`/api/issue/${id}`, {
    method: 'PATCH',
    data: params,
  });
}
