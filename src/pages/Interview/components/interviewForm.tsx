import { IInterviewInfos } from '@/services/interview/typings';
import { ITypeInfos } from '@/services/type/typings';
import { formatSelectData } from '@/utils/format';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor, Viewer } from '@toast-ui/react-editor';
import { useModel } from '@umijs/max';
import { Button, Form, Input, Select, Space } from 'antd';
import React, { useEffect, useRef } from 'react';

type FormItem = Partial<IInterviewInfos>;

interface InterviewFormProps {
  type: 'add' | 'update' | 'detail';
  interviewInfo: FormItem;
  setInterviewInfo: (interviewInfo: FormItem) => void;
  submit: (infos: IInterviewInfos, resetFields: () => void) => void;
}

const InterviewForm: React.FC<InterviewFormProps> = ({
  type,
  interviewInfo,
  submit,
}) => {
  const [form] = Form.useForm();

  const editorRef = useRef<any>('');

  const { typeInfos, fetchTypeList } = useModel('type');

  useEffect(() => {
    if (!typeInfos || typeInfos?.length === 0) {
      fetchTypeList();
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue(interviewInfo);
    if (type === 'detail') {
      editorRef.current
        .getInstance()
        .setMarkdown(interviewInfo.interviewContent);
    } else {
      editorRef.current.getInstance().setHTML(interviewInfo.interviewContent);
    }
  }, [interviewInfo]);

  const resetAll = () => {
    form.resetFields();
  };

  const handleSubmit = (values: FormItem) => {
    submit(
      {
        ...values,
        // interviewIntro: editorRef.current.getInstance().getHTML(),
      } as IInterviewInfos,
      resetAll,
    );
  };

  return (
    <Form
      form={form}
      wrapperCol={{ span: 12 }}
      name={`${type}InterviewForm`}
      initialValues={interviewInfo}
      onFinish={handleSubmit}
      disabled={type === 'detail'}
    >
      <Form.Item<FormItem>
        label="面试标题"
        name="interviewTitle"
        rules={[{ required: true, message: '请输入面试标题' }]}
        validateTrigger="onBlur"
      >
        <Input autoComplete="interviewTitle" />
      </Form.Item>

      <Form.Item<FormItem>
        label="面试内容"
        name="interviewContent"
        rules={[{ required: true, message: '请输入面试内容' }]}
      >
        <div style={{ maxHeight: '600px', overflow: 'auto' }}>
          {type === 'detail' ? (
            <Viewer initialValue="" ref={editorRef} />
          ) : (
            <Editor
              initialValue=""
              previewStyle="vertical"
              height="600px"
              initialEditType="markdown"
              useCommandShortcut={true}
              ref={editorRef}
              onBlur={() => {
                form.setFieldsValue({
                  interviewContent: editorRef.current
                    ?.getInstance()
                    .getHTML()
                    .replace(/<p><br><\/p>/, ''),
                });
              }}
            />
          )}
        </div>
      </Form.Item>

      <Form.Item<FormItem>
        label="面试题分类"
        name="typeId"
        rules={[{ required: true, message: '请选择面试题分类' }]}
      >
        <Select
          onChange={(value) => {
            form.setFieldsValue({ typeId: value });
          }}
          options={formatSelectData(typeInfos as ITypeInfos[])}
        ></Select>
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

export default InterviewForm;
