import { adminLoginApi, getCaptcha } from '@/services/admin';
import { IAdminLoginInfos } from '@/services/admin/typings';
import { BarcodeOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Form,
  Input,
  Row,
  Space,
  message,
} from 'antd';
import React, { useEffect, useState } from 'react';

import style from './style.module.css';

type FormItem = IAdminLoginInfos;

const Login: React.FC = () => {
  const [form] = Form.useForm();

  const [loginInfo, setLoginInfo] = useState<IAdminLoginInfos>({
    loginId: '',
    loginPwd: '',
    captcha: '',
  });

  const [messageApi, contextHolder] = message.useMessage();
  // 验证码请求
  const [captcha, setCaptcha] = useState('');

  async function getCaptchaReq() {
    const res = await getCaptcha();
    setCaptcha(res);
  }

  useEffect(() => {
    // 每次弹窗变化要重新请求
    getCaptchaReq();
  }, []);

  const handleSubmit = (value: IAdminLoginInfos) => {
    adminLoginApi(value).then((res) => {
      // 登录失败，重新刷新验证码
      if (!res.data) {
        messageApi.error(res.msg);
        getCaptchaReq();
        return false;
      }

      if (!(res.data as { data: Record<string, string> }).data) {
        messageApi.error('账号密码有误');
        getCaptchaReq();
        return false;
      }

      const adminInfo = (res.data as { data: Record<string, string> })?.data;

      if (!adminInfo.enabled) {
        messageApi.warning('账号已被冻结，请联系管理员');
        getCaptchaReq();
        return false;
      }

      localStorage.setItem('adminToken', (res.data as { token: string }).token);
      location.href = '/';
    });
  };

  // 更新验证码
  const captchaClickHandle = () => {
    getCaptchaReq();
  };

  const resetAll = () => {
    form.resetFields();
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            headerFontSize: 24,
          },
        },
      }}
    >
      <Card className={style.container} title="语林后台管理系统">
        {contextHolder}
        <Form
          form={form}
          initialValues={loginInfo}
          // wrapperCol={{ span: 12 }}
          name={`login-form`}
          onFinish={handleSubmit}
        >
          <Form.Item<FormItem>
            name="loginId"
            rules={[{ required: true, message: '请输入账号' }]}
            validateTrigger="onBlur"
          >
            <Input prefix={<UserOutlined />} placeholder="请输入账号" />
          </Form.Item>

          <Form.Item<FormItem>
            name="loginPwd"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input prefix={<LockOutlined />} placeholder="请输入密码" />
          </Form.Item>

          {/* 验证码 */}
          <Form.Item<FormItem>
            name="captcha"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <Row align="middle">
              <Col span={16}>
                <Input
                  prefix={<BarcodeOutlined />}
                  placeholder="请输入验证码"
                  value={loginInfo.captcha}
                  onChange={(e) =>
                    setLoginInfo({ ...loginInfo, captcha: e.target.value })
                  }
                />
              </Col>
              <Col span={6}>
                <div
                  className={style.captchaImg}
                  onClick={captchaClickHandle}
                  dangerouslySetInnerHTML={{ __html: captcha }}
                ></div>
              </Col>
            </Row>
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
      </Card>
    </ConfigProvider>
  );
};

export default Login;
