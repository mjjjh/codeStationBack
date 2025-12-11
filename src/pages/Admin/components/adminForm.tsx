import { checkAdminLoginIdApi } from '@/services/admin';
import { IAdminInfos } from '@/services/admin/typings';
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';
import { Button, Form, Image, Input, Radio, Space, Upload } from 'antd';
import React, { useEffect } from 'react';

type FormItem = Partial<IAdminInfos>;

interface AdminFormProps {
  type: 'add' | 'update';
  adminInfo: Partial<IAdminInfos>;
  setAdminInfo: (adminInfo: FormItem) => void;
  submit: (infos: IAdminInfos, resetFields: () => void) => void;
}

const AdminForm: React.FC<AdminFormProps> = ({
  type,
  adminInfo,
  setAdminInfo,
  submit,
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(adminInfo);
  }, [adminInfo]);

  // 复制一遍
  // const nowAvatar = useRef(adminInfo.avatar);
  //   校验管理员账号是否存在
  const checkLoginId = async (rule: any, value: string) => {
    if (!value) {
      return Promise.resolve();
    }
    try {
      const res = await checkAdminLoginIdApi(value);
      if (res.data) {
        return Promise.reject(new Error('管理员账号已存在'));
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(new Error('校验账号失败，请稍后重试'));
    }
  };

  const handleSubmit = (values: FormItem) => {
    submit(values as IAdminInfos, form.resetFields);
  };
  return (
    <Form
      form={form}
      wrapperCol={{ span: 12 }}
      name={type === 'add' ? 'addAdmin' : 'updateAdmin'}
      initialValues={adminInfo}
      onFinish={handleSubmit}
    >
      <Form.Item<FormItem>
        label="管理员账号"
        name="loginId"
        rules={
          type === 'add'
            ? [
                { required: true, message: '请输入管理员账号' },
                { validator: checkLoginId },
              ]
            : undefined
        }
        validateTrigger="onBlur"
      >
        <Input disabled={type === 'update'} autoComplete="username" />
      </Form.Item>

      <Form.Item
        label="管理员密码"
        name="password"
        rules={
          type === 'update'
            ? [{ required: true, message: '请输入密码' }]
            : undefined
        }
      >
        <Input.Password
          placeholder="密码可选，默认是123123"
          autoComplete="current-password"
        />
      </Form.Item>

      <Form.Item<FormItem>
        label="管理员昵称"
        name="nickname"
        rules={
          (type === 'update' && [
            { required: true, message: '请输入管理员昵称' },
          ]) ||
          undefined
        }
      >
        <Input />
      </Form.Item>

      <Form.Item<FormItem>
        label="管理员权限"
        name="permission"
        rules={[{ required: true, message: '请输入管理员权限' }]}
      >
        <Radio.Group>
          <Radio.Button value={2}>普通管理员</Radio.Button>
          <Radio.Button value={1}>超级管理员</Radio.Button>
        </Radio.Group>
      </Form.Item>

      {type === 'update' && (
        <Form.Item<FormItem> label="当前头像" name="avatar">
          <Image src={adminInfo.avatar} width={100} />
        </Form.Item>
      )}
      {/* 不使用name属性，避免Form自动传递value给Upload */}
      <Form.Item label="上传头像" valuePropName="fileList">
        <Upload
          maxCount={1}
          name="file"
          listType="picture-card"
          action="/api/upload"
          onChange={(info: any) => {
            if (info.file.status === 'done') {
              setAdminInfo({
                ...adminInfo,
                avatar: info.file.response.data,
              });
            }
          }}
        >
          <div>
            <PlusOutlined />
            <div>头像可选</div>
          </div>
        </Upload>
      </Form.Item>
      <Form.Item label={null}>
        <Space>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button htmlType="reset">重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AdminForm;
