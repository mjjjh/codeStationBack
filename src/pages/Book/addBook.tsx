import { addBookApi, updateBookApi } from '@/services/book';
import { IBookInfos } from '@/services/book/typings';
import { PageContainer } from '@ant-design/pro-components';
import { useLocation, useNavigate } from '@umijs/max';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import BookForm from './components/bookForm';

const AddBook: React.FC = () => {
  const [bookInfos, setBookInfos] = useState<Partial<IBookInfos>>({});

  const [messageApi, contextHolder] = message.useMessage();

  const [type, setType] = useState<'add' | 'update'>('add');

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (location) {
      const { state } = location as {
        state: { bookInfo: IBookInfos; type: 'add' | 'update' };
      };
      if (state) {
        setBookInfos(state?.bookInfo);
        setType(state?.type);
      }
    }
  }, [location]);

  const handleSumit = (infos: IBookInfos, resetFields: () => void) => {
    const params = {
      ...bookInfos,
      ...infos,
    };

    if (type === 'update') {
      updateBookApi(bookInfos._id as string, params).then(() => {
        messageApi
          .open({
            type: 'success',
            content: `修改书籍成功`,
            duration: 1,
          })
          .then(() => {
            navigate('/book/bookList');
          });
      });
      resetFields();
      return;
    }
    if (type === 'add') {
      addBookApi(params).then(() => {
        messageApi
          .open({
            type: 'success',
            content: `新增书籍成功`,
            duration: 1,
          })
          .then(() => {
            navigate('/book/bookList');
          });
      });
      resetFields();
    }
  };

  return (
    <PageContainer>
      {contextHolder}
      <BookForm
        type={type}
        bookInfo={bookInfos}
        setBookInfo={setBookInfos}
        submit={handleSumit}
      />
    </PageContainer>
  );
};

export default AddBook;
