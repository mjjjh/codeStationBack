import useAdminModel from '@/models/adminModel';
import { IAdminInfos } from '@/services/admin/typings';
import { PageContainer } from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { message } from 'antd';
import React, { useState } from 'react';
import AdminForm from './components/adminForm';

const AddAdmin: React.FC = () => {
  const [adminInfo, setAdminInfo] = useState<Partial<IAdminInfos>>({
    avatar: '',
    loginId: '',
    loginPwd: '',
    nickname: '',
    permission: 2,
  });

  const { addAdmin } = useAdminModel();

  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const submit = (infos: IAdminInfos, resetFields: () => void) => {
    const newAdminInfo = {
      ...adminInfo,
      ...infos,
    };
    addAdmin(newAdminInfo).then(() => {
      resetFields();
      messageApi
        .open({
          type: 'success',
          content: '添加管理员成功',
          duration: 1,
        })
        .then(() => {
          navigate('/admin/adminList');
        });
    });
  };

  return (
    <PageContainer>
      {contextHolder}
      <AdminForm
        type="add"
        adminInfo={adminInfo}
        setAdminInfo={setAdminInfo}
        submit={submit}
      />
    </PageContainer>
  );
};

export default AddAdmin;
