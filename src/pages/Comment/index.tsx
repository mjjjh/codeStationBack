import {
  deleteCommentApi,
  getCommentListByModelPageApi,
} from '@/services/comment';
import { ICommentInfos } from '@/services/comment/typings';
import { ITypeInfos } from '@/services/type/typings';
import { formatSelectData } from '@/utils/format';
import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useModel, useNavigate } from '@umijs/max';
import type { RadioChangeEvent } from 'antd';
import { Button, message, Popconfirm, Radio, Select, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

type commentInfoType = Partial<ICommentInfos>;

const Comment: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });
  const tableRef = useRef<any>();

  const navigate = useNavigate();

  const { typeInfos, fetchTypeList } = useModel('type');

  const [commentType, setCommentType] = useState<number>(1);

  useEffect(() => {
    if (!typeInfos || typeInfos?.length === 0) {
      fetchTypeList();
    }
  }, []);

  const reflesh = () => {
    tableRef.current.reload();
  };

  const toCommentForm = (record: commentInfoType, type: string) => {
    navigate(`/commentDetail`, {
      state: {
        interviewInfo: record,
        type: type,
      },
    });
  };

  const handleDeleteComment = async (row: commentInfoType) => {
    try {
      await deleteCommentApi(row._id as string);
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

  const onChange = (e: RadioChangeEvent) => {
    setCommentType(e.target.value);
    reflesh();
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
      dataIndex: 'issueTitle',
      title: '问答标题',
      key: 'issueTitle',
      align: 'center',
      search: false,
      hidden: +commentType === 2,
      render: (_, record) => {
        return <span>{record.issueTitle?.substring(0, 20) + '...'}</span>;
      },
    },
    {
      dataIndex: 'bookTitle',
      title: '书籍标题',
      key: 'bookTitle',
      align: 'center',
      search: false,
      hidden: +commentType === 1,
      render: (_, record) => {
        return <span>{record.bookName?.substring(0, 20) + '...'}</span>;
      },
    },
    {
      dataIndex: 'commentContent',
      title: '评论内容',
      key: 'commentContent',
      align: 'center',
      render: (_, record) => {
        const reg = /<[^<>]+>/g;
        const str = record.commentContent?.replace(reg, '') as string;
        if (str.length > 20) {
          return str.substring(0, 20) + '...';
        } else {
          return str;
        }
      },
    },
    {
      dataIndex: 'nickname',
      title: '评论用户',
      key: 'nickname',
      align: 'center',
      search: false,
      render: (_, record) => {
        return (
          <div key={record._id}>
            <Tag color="blue">{record.nickname}</Tag>
          </div>
        );
      },
    },
    {
      dataIndex: 'typeId',
      title: '评论类型',
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
      title: '操作',
      key: 'options',
      align: 'center',
      render: (_, record) => {
        return (
          <div key={record._id}>
            <Button
              type="link"
              size="small"
              onClick={() => toCommentForm(record, 'detail')}
            >
              详情
            </Button>
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
    },
  ];

  return (
    <>
      <PageContainer>
        {contextHolder}
        <Radio.Group
          value={commentType}
          onChange={onChange}
          style={{ marginBottom: 8 }}
        >
          <Radio.Button value={1}>问答评论</Radio.Button>
          <Radio.Button value={2}>书籍评论</Radio.Button>
        </Radio.Group>

        <ProTable<commentInfoType>
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
            params: commentInfoType & { pageSize?: number; current?: number },
          ) => {
            const res = await getCommentListByModelPageApi(commentType, params);
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

export default Comment;
