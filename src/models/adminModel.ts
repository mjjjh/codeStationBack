import {
  addAdminApi,
  deleteAdminApi,
  getAdminListApi,
  updateAdminApi,
} from '@/services/admin';
import { IAdminInfos } from '@/services/admin/typings';
import { useState } from 'react';
const useAdminModel = () => {
  const [adminInfos, setAdminInfos] = useState<IAdminInfos[]>();

  // 获取管理员列表
  const fetchAdminList = async () => {
    const res = await getAdminListApi();
    setAdminInfos(res.data);
  };

  // 删除管理员
  const deleteAdmin = async (id: string) => {
    await deleteAdminApi(id);
    setAdminInfos((pre) => pre?.filter((item) => item._id !== id));
  };

  // 修改管理员
  const updateAdmin = async (id: string, data: Partial<IAdminInfos>) => {
    await updateAdminApi(id, data);
    setAdminInfos((pre) =>
      pre?.map((item) => (item._id === id ? { ...item, ...data } : item)),
    );
  };
  // 添加管理员
  const addAdmin = async (data: IAdminInfos) => {
    await addAdminApi(data);
    setAdminInfos((pre) => [...(pre || []), data]);
  };

  return { adminInfos, fetchAdminList, deleteAdmin, updateAdmin, addAdmin };
};

export default useAdminModel;
