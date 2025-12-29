import { IAdminInfos } from '@/services/admin/typings';
import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Image, message, Modal, Popconfirm, Switch, Tag } from 'antd';
import React, { useEffect } from 'react';
import AdminForm from './components/adminForm';

const AdminPage: React.FC = () => {
  const { adminInfos, fetchAdminList, deleteAdmin, updateAdmin } =
    useModel('adminModel');
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = React.useState(false);
  const [record, setRecord] = React.useState<Partial<IAdminInfos>>({});

  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    fetchAdminList();
  }, []);

  const showModal = (record: IAdminInfos) => {
    setOpen(true);
    setRecord(record);
  };

  const handleOk = (params: Partial<IAdminInfos>, resetFields: () => void) => {
    const newParams = {
      ...params,
      avatar: record.avatar,
    };
    updateAdmin(record._id as string, newParams).then(() => {
      resetFields();
      setOpen(false);
      messageApi.open({
        type: 'success',
        content: '修改成功',
      });
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSwitchChange = async (value: boolean, row: IAdminInfos) => {
    try {
      await updateAdmin(row._id, { enabled: value });
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

  const handleDeleteAdmin = async (row: IAdminInfos) => {
    try {
      await deleteAdmin(row._id);
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
        return record._id === initialState?._id ? (
          <Tag color="red">-</Tag>
        ) : (
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
    },
    {
      title: '操作',
      key: 'options',
      align: 'center',
      render: (_, record) => {
        return (
          <div key={record._id}>
            <Button type="link" size="small" onClick={() => showModal(record)}>
              编辑
            </Button>
            <Popconfirm
              title="是否删除?"
              onConfirm={() => handleDeleteAdmin(record)}
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
    },
  ];

  return (
    <>
      <PageContainer>
        {contextHolder}
        <ProTable<IAdminInfos>
          headerTitle="查询表格"
          dataSource={adminInfos}
          columns={columns}
          rowKey="_id"
          search={false}
          pagination={{ pageSize: 5 }}
        />
      </PageContainer>
      <Modal
        open={open}
        title="修改管理员信息"
        onCancel={handleCancel}
        footer={null}
      >
        <AdminForm
          type="update"
          adminInfo={record}
          setAdminInfo={setRecord}
          submit={handleOk}
        />
      </Modal>
    </>
  );
};

export default AdminPage;
