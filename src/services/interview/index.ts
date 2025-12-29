import { request } from '@umijs/max';
import {
  IInterviewInfos,
  IInterviewParams,
  IResInterviewInfos,
} from './typings';
/**
 * 分页查找面试题信息
 */
export async function getInterviewListByPageApi(
  params: Partial<IInterviewParams>,
) {
  return request<API.Result<IResInterviewInfos>>('/api/interview', {
    method: 'GET',
    params,
  });
}

/**
 * 添加面试题
 */
export async function addInterviewApi(data: IInterviewInfos) {
  return request<API.Result<string>>('/api/interview', {
    method: 'POST',
    data,
  });
}

/**
 * 删除面试题
 */
export async function deleteInterviewApi(id: string) {
  return request<API.Result<string>>(`/api/interview/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 修改面试题
 */
export async function updateInterviewApi(
  id: string,
  data: Partial<IInterviewInfos>,
) {
  return request<API.Result<string>>(`/api/interview/${id}`, {
    method: 'PATCH',
    data,
  });
}
