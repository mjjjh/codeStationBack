import { IAdminInfos } from '@/services/admin/typings';
import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Image, Switch, Tag } from 'antd';
import React, { useEffect } from 'react';

const AdminPage: React.FC = () => {
  const { adminInfos, fetchAdminList } = useModel('adminModel');
  useEffect(() => {
    fetchAdminList();
  }, []);

  const columns: ProColumns<IAdminInfos>[] = [
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
    },
    {
      dataIndex: 'permission',
      title: '权限',
      key: 'permission',
      align: 'center',
      render: (_, record) => {
        const tag =
          record.permission === 1 ? (
            <Tag color="orange" key={record._id}>
              超级管理员
            </Tag>
          ) : (
            <Tag color="blue" key={record._id}>
              普通管理员
            </Tag>
          );
        return tag;
      },
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
            onChange={() => {}}
          />
        );
      },
    },
    {
      title: '操作',
      key: 'options',
      align: 'center',
      render: (_, record) => {
        return (
          <div key={record._id}>
            <Button type="link" size="small">
              编辑
            </Button>
            <Button type="link" size="small">
              删除
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<IAdminInfos>
        headerTitle="查询表格"
        dataSource={adminInfos}
        columns={columns}
        rowKey="_id"
        search={false}
        pagination={{ pageSize: 5 }}
      />
    </PageContainer>
  );
};

export default AdminPage;
