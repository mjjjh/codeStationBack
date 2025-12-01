import { getAdminList } from '@/services/admin';
import { IAdminInfos } from '@/services/admin/typings';
import { useState } from 'react';
const useAdminModel = () => {
  const [adminInfos, setAdminInfos] = useState<IAdminInfos[]>();

  const fetchAdminList = async () => {
    const res = await getAdminList();
    setAdminInfos(res.data);
  };

  return { adminInfos, fetchAdminList };
};

export default useAdminModel;
