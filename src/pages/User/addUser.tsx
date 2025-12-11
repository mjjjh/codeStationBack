import { addUserApi, updateUserApi } from '@/services/user';
import { IUserInfos } from '@/services/user/typings';
import { PageContainer } from '@ant-design/pro-components';
import { useLocation, useNavigate } from '@umijs/max';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import UserForm from './components/userForm';

const AddUser: React.FC = () => {
  const [userInfos, setUserInfos] = useState<Partial<IUserInfos>>({});

  const [messageApi, contextHolder] = message.useMessage();

  const [type, setType] = useState<'add' | 'update' | 'detail'>('add');

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (location) {
      const { state } = location as {
        state: { userInfo: IUserInfos; type: 'add' | 'update' | 'detail' };
      };
      if (state) {
        setUserInfos(state?.userInfo);
        setType(state?.type);
      }
    }
  }, [location]);

  const handleSumit = (infos: IUserInfos, resetFields: () => void) => {
    const params = {
      ...userInfos,
      ...infos,
    };

    if (type === 'update') {
      updateUserApi(userInfos._id as string, params).then(() => {
        messageApi
          .open({
            type: 'success',
            content: `修改用户成功`,
            duration: 1,
          })
          .then(() => {
            navigate('/user/userList');
          });
      });
      resetFields();
      return;
    }
    if (type === 'add') {
      addUserApi(params).then(() => {
        messageApi
          .open({
            type: 'success',
            content: `新增用户成功`,
            duration: 1,
          })
          .then(() => {
            navigate('/user/userList');
          });
      });
      resetFields();
    }
  };

  return (
    <PageContainer
      title={
        type === 'add'
          ? '添加用户'
          : type === 'detail'
          ? '用户详情'
          : '编辑用户'
      }
    >
      {contextHolder}
      <UserForm
        type={type}
        userInfo={userInfos}
        setUserInfo={setUserInfos}
        submit={handleSumit}
      />
    </PageContainer>
  );
};

export default AddUser;
