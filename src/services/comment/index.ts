import { request } from '@umijs/max';
import { ICommentParams, IResCommentInfos } from './typings';
/**
 * 根据模块分页查找评论信息
 */
export async function getCommentListByModelPageApi(
  model: number,
  params: Partial<ICommentParams>,
) {
  return request<API.Result<IResCommentInfos>>(`/api/comment/${model}`, {
    method: 'GET',
    params,
  });
}

/**
 * 删除评论
 */
export async function deleteCommentApi(id: string) {
  return request<API.Result<string>>(`/api/comment/${id}`, {
    method: 'DELETE',
  });
}
