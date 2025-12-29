import {
  deleteInterviewApi,
  getInterviewListByPageApi,
} from '@/services/interview';
import { IInterviewInfos } from '@/services/interview/typings';
import { ITypeInfos } from '@/services/type/typings';
import { formatSelectData, formatTime } from '@/utils/format';
import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useModel, useNavigate } from '@umijs/max';
import { Button, message, Popconfirm, Select, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

type interviewInfoType = Partial<IInterviewInfos>;

const InterView: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const navigate = useNavigate();

  const tableRef = useRef<any>();

  const { typeInfos, fetchTypeList } = useModel('type');

  useEffect(() => {
    if (!typeInfos || typeInfos?.length === 0) {
      fetchTypeList();
    }
  }, []);

  const reflesh = () => {
    tableRef.current.reload();
  };

  const toInterviewForm = (record: interviewInfoType, type: string) => {
    navigate(`/interview/editInterview`, {
      state: {
        interviewInfo: record,
        type: type,
      },
    });
  };

  const handleDeleteInterview = async (row: interviewInfoType) => {
    try {
      await deleteInterviewApi(row._id as string);
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

  const columns: ProColumns<interviewInfoType>[] = [
    {
      title: '序号',
      width: 50,
      align: 'center',
      render: (text, record, index) =>
        pagination.pageSize * (pagination.current - 1) + index + 1,
      search: false,
    },
    {
      dataIndex: 'interviewTitle',
      title: '面试题名称',
      key: 'interviewTitle',
      align: 'center',
    },
    {
      dataIndex: 'interviewType',
      title: '面试题类型',
      key: 'interviewType',
      align: 'center',
      render: (_, record) => {
        return (
          <Tag color="blue">
            {typeInfos?.find((item) => item._id === record.typeId)?.typeName}
          </Tag>
        );
      },
      renderFormItem: (_, { value }) => {
        return (
          <Select
            value={value}
            options={formatSelectData(typeInfos as ITypeInfos[])}
          ></Select>
        );
      },
    },

    {
      dataIndex: 'onShelfDate',
      title: '上架时间',
      key: 'onShelfDate',
      align: 'center',
      search: false,
      render: (_, record) => {
        return formatTime(record.onShelfDate as string);
      },
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
              onClick={() => toInterviewForm(record, 'detail')}
            >
              详情
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => toInterviewForm(record, 'update')}
            >
              编辑
            </Button>
            <Popconfirm
              title="是否删除?"
              onConfirm={() => handleDeleteInterview(record)}
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
        <ProTable<interviewInfoType>
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
            params: interviewInfoType & { pageSize?: number; current?: number },
          ) => {
            const res = await getInterviewListByPageApi(params);
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

export default InterView;
