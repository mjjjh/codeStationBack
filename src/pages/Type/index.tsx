import { ITypeInfos } from '@/services/type/typings';
import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useAccess, useModel } from '@umijs/max';
import { Button, Input, message, Popconfirm, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

type commentInfoType = Partial<ITypeInfos>;

const Type: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [addTypeName, setAddTypeName] = useState<string>('');

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });
  const tableRef = useRef<any>();

  const access = useAccess();

  const { typeInfos, fetchTypeList, addType, deleteType } = useModel('type');

  useEffect(() => {
    if (!typeInfos || typeInfos?.length === 0) {
      fetchTypeList();
    }
  }, []);

  const handleDeleteComment = async (row: commentInfoType) => {
    try {
      await deleteType(row._id as string);
      // reflesh();
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

  const handleAddType = async () => {
    const res = await addType({ typeName: addTypeName });
    if (res === true) {
      messageApi.open({
        type: 'success',
        content: '添加成功',
      });
    } else {
      messageApi.open({
        type: 'error',
        content: '添加失败' + res,
      });
    }
  };

  const columns: ProColumns<commentInfoType>[] = [
    {
      title: '序号',
      width: 50,
      align: 'center',
      render: (text, record, index) =>
        pagination.pageSize * (pagination.current - 1) + index + 1,
      search: false,
    },
    {
      dataIndex: 'typeName',
      title: '分类名称',
      key: 'typeName',
      align: 'center',
      search: false,
    },
  ];

  if (access.SuperAdmin) {
    columns.push({
      title: '操作',
      key: 'options',
      align: 'center',
      render: (_, record) => {
        return (
          <div key={record._id}>
            <Popconfirm
              title="是否删除?"
              onConfirm={() => handleDeleteComment(record)}
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
    });
  }

  return (
    <>
      <PageContainer>
        {contextHolder}
        <Space style={{ marginBottom: '20px' }}>
          <Input
            value={addTypeName}
            onChange={(e) => setAddTypeName(e.target.value)}
            placeholder="填写新增类型"
          />
          <Button type="primary" onClick={handleAddType}>
            新增
          </Button>
        </Space>
        <ProTable<commentInfoType>
          headerTitle="查询表格"
          columns={columns}
          rowKey="_id"
          actionRef={tableRef}
          search={false}
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
          dataSource={typeInfos}
        />
      </PageContainer>
    </>
  );
};

export default Type;
