import {
  addTypeApi,
  deleteTypeApi,
  getTypeListApi,
} from '@/services/type/index';
import { ITypeInfos, ITypeParams } from '@/services/type/typings';
import { useState } from 'react';
const useTypeModel = () => {
  const [typeInfos, setTypeInfos] = useState<ITypeInfos[]>();

  // 获取type列表
  const fetchTypeList = async () => {
    const res = await getTypeListApi();
    setTypeInfos(res.data);
  };

  // 删除type
  const deleteType = async (id: string) => {
    await deleteTypeApi(id);
    setTypeInfos((pre) => pre?.filter((item) => item._id !== id));
  };

  // 添加type
  const addType = async (data: ITypeParams) => {
    try {
      await addTypeApi(data);
      return true;
    } catch (error) {
      return error;
    } finally {
      fetchTypeList();
    }
  };

  return { typeInfos, fetchTypeList, deleteType, addType };
};

export default useTypeModel;
