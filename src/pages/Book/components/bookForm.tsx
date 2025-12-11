import { IBookInfos } from '@/services/book/typings';
import { ITypeInfos } from '@/services/type/typings';
import { formatSelectData } from '@/utils/format';
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { useModel } from '@umijs/max';
import { Button, Form, Image, Input, Select, Space, Upload } from 'antd';
import React, { useEffect, useRef } from 'react';

type FormItem = Partial<IBookInfos>;

interface BookFormProps {
  type: 'add' | 'update';
  bookInfo: FormItem;
  setBookInfo: (bookInfo: FormItem) => void;
  submit: (infos: IBookInfos, resetFields: () => void) => void;
}

const BookForm: React.FC<BookFormProps> = ({
  type,
  bookInfo,
  setBookInfo,
  submit,
}) => {
  const [form] = Form.useForm();

  const editorRef = useRef<any>('');

  const { typeInfos, fetchAdminList } = useModel('type');

  useEffect(() => {
    if (!typeInfos || typeInfos?.length === 0) {
      fetchAdminList();
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue(bookInfo);
    editorRef.current.getInstance().setHTML(bookInfo.bookIntro);
  }, [bookInfo]);

  const resetAll = () => {
    form.resetFields();
    if (type === 'add') {
      setBookInfo({
        ...bookInfo,
        bookPic: '',
      });
      form.setFieldsValue({
        bookPic: '',
      });
    }
  };

  const handleSubmit = (values: FormItem) => {
    submit(
      {
        ...values,
        bookIntro: editorRef.current.getInstance().getHTML(),
      } as IBookInfos,
      resetAll,
    );
  };

  return (
    <Form
      form={form}
      wrapperCol={{ span: 12 }}
      name={`${type}UserForm`}
      initialValues={bookInfo}
      onFinish={handleSubmit}
    >
      <Form.Item<FormItem>
        label="书籍标题"
        name="bookTitle"
        rules={[{ required: true, message: '请输入书籍标题' }]}
        validateTrigger="onBlur"
      >
        <Input autoComplete="bookTitle" />
      </Form.Item>

      <Form.Item<FormItem>
        label="书籍介绍"
        name="bookIntro"
        rules={[{ required: true, message: '请输入书籍介绍' }]}
      >
        <Editor
          initialValue=""
          previewStyle="vertical"
          height="600px"
          initialEditType="markdown"
          useCommandShortcut={true}
          ref={editorRef}
        />
      </Form.Item>

      <Form.Item<FormItem>
        label="下载链接"
        name="downloadLink"
        rules={[{ required: true, message: '请输入下载链接' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FormItem>
        label="所需积分"
        name="requirePoints"
        rules={[{ required: true, message: '请输入所需积分' }]}
      >
        <Input type="number" />
      </Form.Item>

      <Form.Item<FormItem>
        label="书籍分类"
        name="typeId"
        rules={[{ required: true, message: '请输入所需积分' }]}
      >
        <Select
          onChange={(value) => {
            form.setFieldsValue({ typeId: value });
          }}
          options={formatSelectData(typeInfos as ITypeInfos[])}
        ></Select>
      </Form.Item>

      {type !== 'add' && (
        <Form.Item<FormItem> label="当前封面" name="bookPic">
          <Image src={bookInfo.bookPic} width={100} />
        </Form.Item>
      )}
      {/* 不使用name属性，避免Form自动传递value给Upload */}
      <Form.Item
        label="书籍封面"
        name="bookPic"
        rules={[
          type === 'add' ? { required: true, message: '请上传书籍封面' } : {},
        ]}
      >
        <Upload
          maxCount={1}
          name="file"
          listType="picture-card"
          action="/api/upload"
          onChange={(info: any) => {
            if (info.file.status === 'done') {
              setBookInfo({
                ...bookInfo,
                bookPic: info.file.response.data,
              });
              form.setFieldsValue({
                bookPic: info.file.response.data,
              });
            } else if (info.file.status === 'removed') {
              setBookInfo({
                ...bookInfo,
                bookPic: '',
              });
              form.setFieldsValue({
                bookPic: '',
              });
            }
          }}
        >
          <div>
            <PlusOutlined />
            <div>书籍封面</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item label={null}>
        <Space>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button htmlType="reset" onClick={resetAll}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default BookForm;
