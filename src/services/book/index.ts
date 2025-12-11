import { request } from '@umijs/max';
import { IBookInfos, IBookParams, IResBookInfos } from './typings';
/**
 * 分页查找书籍信息
 */
export async function getBookListByPageApi(params: Partial<IBookParams>) {
  return request<API.Result<IResBookInfos>>('/api/book', {
    method: 'GET',
    params,
  });
}

/**
 * 添加书籍
 */
export async function addBookApi(data: IBookInfos) {
  return request<API.Result<string>>('/api/book', {
    method: 'POST',
    data,
  });
}

/**
 * 删除书籍
 */
export async function deleteBookApi(id: string) {
  return request<API.Result<string>>(`/api/book/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 修改书籍
 */
export async function updateBookApi(id: string, data: Partial<IBookInfos>) {
  return request<API.Result<string>>(`/api/book/${id}`, {
    method: 'PATCH',
    data,
  });
}
