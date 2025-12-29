import {
  deleteIssueApi,
  getIssueListByPageApi,
  updateIssueApi,
} from '@/services/issue';
import { IIssueInfos } from '@/services/issue/typings';
import { ITypeInfos } from '@/services/type/typings';
import { formatSelectData } from '@/utils/format';
import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useModel, useNavigate } from '@umijs/max';
import { Button, message, Popconfirm, Select, Switch, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

type issueInfoType = Partial<IIssueInfos>;

const Issue: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });
  const tableRef = useRef<any>();

  const navigate = useNavigate();

  const { typeInfos, fetchTypeList } = useModel('type');

  useEffect(() => {
    if (!typeInfos || typeInfos?.length === 0) {
      fetchTypeList();
    }
  }, []);

  const reflesh = () => {
    tableRef.current.reload();
  };

  const toIssueForm = (record: issueInfoType, type: string) => {
    navigate(`/issueDetail`, {
      state: {
        interviewInfo: record,
        type: type,
      },
    });
  };

  const handleDeleteIssue = async (row: issueInfoType) => {
    try {
      await deleteIssueApi(row._id as string);
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

  const handleSwitchChange = async (value: boolean, row: issueInfoType) => {
    console.log(typeof value);

    try {
      await updateIssueApi(row._id as string, { issueStatus: value });
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
    reflesh();
  };

  const columns: ProColumns<issueInfoType>[] = [
    {
      title: '序号',
      width: 50,
      align: 'center',
      render: (text, record, index) =>
        pagination.pageSize * (pagination.current - 1) + index + 1,
      search: false,
    },
    {
      dataIndex: 'issueTitle',
      title: '问答标题',
      key: 'issueTitle',
      align: 'center',
    },

    {
      dataIndex: 'issueContent',
      title: '问答描述',
      key: 'issueContent',
      align: 'center',
      search: false,
      render: (_, record) => {
        const reg = /<[^<>]+>/g;
        const str = record.issueContent?.replace(reg, '') as string;
        if (str.length > 20) {
          return str.substring(0, 20) + '...';
        } else {
          return str;
        }
      },
    },
    {
      dataIndex: 'scanNumber',
      title: '浏览数',
      key: 'scanNumber',
      align: 'center',
      search: false,
    },
    {
      dataIndex: 'commentNumber',
      title: '评论数',
      key: 'commentNumber',
      align: 'center',
      search: false,
    },
    {
      dataIndex: 'typeId',
      title: '书籍类型',
      key: 'typeId',
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
      dataIndex: 'issueStatus',
      title: '审核状态',
      key: 'issueStatus',
      align: 'center',
      render: (_, record) => {
        return (
          <Switch
            checkedChildren="通过"
            unCheckedChildren="未通过"
            size="small"
            key={record._id}
            checked={record.issueStatus === true}
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
              onClick={() => toIssueForm(record, 'detail')}
            >
              详情
            </Button>
            <Popconfirm
              title="是否删除?"
              onConfirm={() => handleDeleteIssue(record)}
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
        <ProTable<issueInfoType>
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
            params: issueInfoType & { pageSize?: number; current?: number },
          ) => {
            const res = await getIssueListByPageApi(params);
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

export default Issue;
