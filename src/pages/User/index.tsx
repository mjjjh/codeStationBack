import {
  deleteUserApi,
  getUserListByPageApi,
  updateUserApi,
} from '@/services/user';
import { IUserInfos } from '@/services/user/typings';
import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { Button, Image, message, Popconfirm, Switch } from 'antd';
import React, { useRef, useState } from 'react';

type uerInfoType = Partial<IUserInfos>;

const User: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const navigate = useNavigate();

  const tableRef = useRef<any>();

  const reflesh = () => {
    tableRef.current.reload();
  };

  const handleSwitchChange = async (value: boolean, record: uerInfoType) => {
    try {
      await updateUserApi(record._id as string, { enabled: value });
      reflesh();
      messageApi.open({
        type: 'success',
        content: '修改成功',
      });
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: '修改失败',
      });
    }
  };

  const toUserForm = (record: uerInfoType, type: string) => {
    if (type === 'detail') {
      navigate(`/user/addUser`, {
        state: {
          userInfo: record,
          type: 'detail',
        },
      });
    } else if (type === 'update') {
      navigate(`/user/editUser`, {
        state: {
          userInfo: record,
          type: 'update',
        },
      });
    }
  };

  const handleDeleteUser = async (row: uerInfoType) => {
    try {
      await deleteUserApi(row._id as string);
      reflesh();
      messageApi.open({
        type: 'success',
        content: '删除成功',
      });
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: '删除失败',
      });
    }
  };

  const columns: ProColumns<uerInfoType>[] = [
    {
      title: '序号',
      width: 50,
      align: 'center',
      render: (text, record, index) =>
        pagination.pageSize * (pagination.current - 1) + index + 1,
      search: false,
    },
    {
      dataIndex: 'loginId',
      title: '登录账号',
      key: 'loginId',
      align: 'center',
    },
    {
      dataIndex: 'loginPwd',
      title: '登录密码',
      key: 'loginPwd',
      align: 'center',
      search: false,
    },
    {
      dataIndex: 'nickname',
      title: '昵称',
      key: 'nickname',
      align: 'center',
    },
    {
      dataIndex: 'avatar',
      title: '头像',
      key: 'avatar',
      align: 'center',
      render: (_, record) => {
        return <Image width={100} src={record.avatar} />;
      },
      search: false,
    },
    {
      dataIndex: 'enabled',
      title: '账号状态',
      key: 'enabled',
      align: 'center',
      render: (_, record) => {
        return (
          <Switch
            checkedChildren="启用"
            unCheckedChildren="禁用"
            size="small"
            key={record._id}
            checked={record.enabled === true}
            onChange={(value) => handleSwitchChange(value, record)}
          />
        );
      },
      search: false,
    },
    {
      title: '操作',
      key: 'options',
      align: 'center',
      render: (_, record) => {
        return (
          <div key={record._id}>
            <Button
              type="link"
              size="small"
              onClick={() => toUserForm(record, 'update')}
            >
              编辑
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => toUserForm(record, 'detail')}
            >
              详情
            </Button>
            <Popconfirm
              title="是否删除?"
              onConfirm={() => handleDeleteUser(record)}
              okText="是"
              cancelText="否"
            >
              <Button type="link" size="small">
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      },
      search: false,
    },
  ];

  return (
    <>
      <PageContainer>
        {contextHolder}
        <ProTable<uerInfoType>
          headerTitle="查询表格"
          columns={columns}
          rowKey="_id"
          actionRef={tableRef}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize: pagination.pageSize,
            current: pagination.current,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize: pageSize });
            },
            pageSizeOptions: ['5', '10', '20', '30'],
          }}
          request={async (
            params: uerInfoType & { pageSize?: number; current?: number },
          ) => {
            const res = await getUserListByPageApi(params);
            return {
              data: res.data.data,
              total: res.data.count,
              success: res.code === 0,
            };
          }}
        />
      </PageContainer>
    </>
  );
};

export default User;
