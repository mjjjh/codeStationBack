import { IUserInfos } from '@/services/user/typings';
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';
import { Button, Form, Image, Input, Radio, Space, Upload } from 'antd';
import React, { useEffect } from 'react';

type FormItem = Partial<IUserInfos>;

interface UserFormProps {
  type: 'add' | 'update' | 'detail';
  userInfo: FormItem;
  setUserInfo: (userInfo: FormItem) => void;
  submit: (infos: IUserInfos, resetFields: () => void) => void;
}

const UserForm: React.FC<UserFormProps> = ({
  type,
  userInfo,
  setUserInfo,
  submit,
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(userInfo);
  }, [userInfo]);

  // 复制一遍
  // const nowAvatar = useRef(adminInfo.avatar);
  //   校验用户账号是否存在
  const checkLoginId = async (rule: any, value: string) => {
    if (!value) {
      return Promise.resolve();
    }
    // try {
    //     const res = await checkAdminLoginIdApi(value);
    //     if (res.data) {
    //         return Promise.reject(new Error('用户账号已存在'));
    //     }
    //     return Promise.resolve();
    // } catch (error) {
    //     return Promise.reject(new Error('校验账号失败，请稍后重试'));
    // }
  };

  const handleSubmit = (values: FormItem) => {
    submit(values as IUserInfos, form.resetFields);
  };
  return (
    <Form
      form={form}
      wrapperCol={{ span: 12 }}
      name={`${type}UserForm`}
      initialValues={userInfo}
      onFinish={handleSubmit}
      disabled={type === 'detail'}
    >
      <Form.Item<FormItem>
        label="用户账号"
        name="loginId"
        rules={
          type === 'add'
            ? [
                { required: true, message: '请输入用户账号' },
                { validator: checkLoginId },
              ]
            : undefined
        }
        validateTrigger="onBlur"
      >
        <Input disabled={!(type === 'add')} autoComplete="username" />
      </Form.Item>

      <Form.Item
        label="用户密码"
        name="password"
        rules={
          type === 'update'
            ? [{ required: true, message: '请输入密码' }]
            : undefined
        }
      >
        <Input.Password
          placeholder="密码可选，默认是123456"
          autoComplete="current-password"
        />
      </Form.Item>

      <Form.Item<FormItem>
        label="用户昵称"
        name="nickname"
        rules={
          (type === 'update' && [
            { required: true, message: '请输入用户昵称' },
          ]) ||
          undefined
        }
      >
        <Input />
      </Form.Item>
      {type !== 'add' && (
        <Form.Item<FormItem> label="当前头像" name="avatar">
          <Image src={userInfo.avatar} width={100} />
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
              setUserInfo({
                ...userInfo,
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

      <Form.Item<FormItem> label="用户邮箱" name="mail">
        <Input placeholder="选填" />
      </Form.Item>

      <Form.Item<FormItem> label="微信号" name="wechat">
        <Input placeholder="选填" />
      </Form.Item>

      <Form.Item<FormItem> label="QQ号" name="qq">
        <Input placeholder="选填" />
      </Form.Item>

      <Form.Item<FormItem> label="GitHub" name="github">
        <Input placeholder="选填" />
      </Form.Item>

      <Form.Item<FormItem> label="自我介绍" name="intro">
        <Input.TextArea placeholder="选填" />
      </Form.Item>

      <Form.Item<FormItem>
        label="用户状态"
        name="enabled"
        rules={[{ required: true, message: '请选择用户状态' }]}
      >
        <Radio.Group>
          <Radio.Button value={false}>禁用</Radio.Button>
          <Radio.Button value={true}>启用</Radio.Button>
        </Radio.Group>
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

export default UserForm;
