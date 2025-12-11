import { deleteBookApi, getBookListByPageApi } from '@/services/book';
import { IBookInfos } from '@/services/book/typings';
import { formatTime } from '@/utils/format';
import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useModel, useNavigate } from '@umijs/max';
import { Button, Image, message, Modal, Popconfirm, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

type bookInfoType = Partial<IBookInfos>;

const Book: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = React.useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const navigate = useNavigate();

  const tableRef = useRef<any>();

  const { typeInfos, fetchAdminList } = useModel('type');

  useEffect(() => {
    if (!typeInfos || typeInfos?.length === 0) {
      fetchAdminList();
    }
  }, []);

  const reflesh = () => {
    tableRef.current.reload();
  };

  const toBookForm = (record: bookInfoType, type: string) => {
    navigate(`/book/editBook`, {
      state: {
        bookInfo: record,
        type: type,
      },
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleDeleteBook = async (row: bookInfoType) => {
    try {
      await deleteBookApi(row._id as string);
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

  const columns: ProColumns<bookInfoType>[] = [
    {
      title: '序号',
      width: 50,
      align: 'center',
      render: (text, record, index) =>
        pagination.pageSize * (pagination.current - 1) + index + 1,
      search: false,
    },
    {
      dataIndex: 'bookTitle',
      title: '书籍名称',
      key: 'bookTitle',
      align: 'center',
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
    },
    {
      dataIndex: 'bookIntro',
      title: '书籍简介',
      key: 'bookIntro',
      align: 'center',
      search: false,
      render: (_, record) => {
        const reg = /<[^<>]+>/g;
        const str = record.bookIntro?.replace(reg, '') as string;
        if (str.length > 20) {
          return str.substring(0, 20) + '...';
        } else {
          return record.bookIntro;
        }
      },
    },
    {
      dataIndex: 'bookPic',
      title: '书籍封面',
      key: 'bookPic',
      align: 'center',
      search: false,
      render: (_, record) => {
        return <Image width={100} src={record.bookPic} />;
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
              onClick={() => toBookForm(record, 'update')}
            >
              编辑
            </Button>
            <Popconfirm
              title="是否删除?"
              onConfirm={() => handleDeleteBook(record)}
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
        <ProTable<bookInfoType>
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
            params: bookInfoType & { pageSize?: number; current?: number },
          ) => {
            const res = await getBookListByPageApi(params);
            return {
              data: res.data.data,
              total: res.data.count,
              success: res.code === 0,
            };
          }}
        />
      </PageContainer>
      <Modal
        open={open}
        title="修改管理员信息"
        onCancel={handleCancel}
        footer={null}
      >
        {/* <AdminForm type="update" adminInfo={record} setAdminInfo={setRecord} submit={handleOk} /> */}
      </Modal>
    </>
  );
};

export default Book;
