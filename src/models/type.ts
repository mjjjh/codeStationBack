import { getTypeListApi } from '@/services/type/index';
import { ITypeInfos } from '@/services/type/typings';
import { useState } from 'react';
const useTypeModel = () => {
  const [typeInfos, setTypeInfos] = useState<ITypeInfos[]>();

  // 获取管理员列表
  const fetchAdminList = async () => {
    const res = await getTypeListApi();
    setTypeInfos(res.data);
  };

  return { typeInfos, fetchAdminList };
};

export default useTypeModel;
