import { addInterviewApi, updateInterviewApi } from '@/services/interview';
import { IInterviewInfos } from '@/services/interview/typings';
import { PageContainer } from '@ant-design/pro-components';
import { useLocation, useNavigate } from '@umijs/max';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import InterviewForm from './components/interviewForm';

const AddInterview: React.FC = () => {
  const [interviewInfos, setInterviewInfos] = useState<
    Partial<IInterviewInfos>
  >({});

  const [messageApi, contextHolder] = message.useMessage();

  const [type, setType] = useState<'add' | 'update' | 'detail'>('add');

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (location) {
      const { state } = location as {
        state: {
          interviewInfo: IInterviewInfos;
          type: 'add' | 'update' | 'detail';
        };
      };
      if (state) {
        setInterviewInfos(state?.interviewInfo);
        setType(state?.type);
      }
    }
  }, [location]);

  const handleSumit = (infos: IInterviewInfos, resetFields: () => void) => {
    const params = {
      ...interviewInfos,
      ...infos,
    };

    if (type === 'update') {
      updateInterviewApi(interviewInfos._id as string, params).then(() => {
        messageApi
          .open({
            type: 'success',
            content: `修改面试题成功`,
            duration: 1,
          })
          .then(() => {
            navigate('/interview/interviewList');
          });
      });
      resetFields();
      return;
    }
    if (type === 'add') {
      addInterviewApi(params).then(() => {
        messageApi
          .open({
            type: 'success',
            content: `新增面试题成功`,
            duration: 1,
          })
          .then(() => {
            navigate('/interview/interviewList');
          });
      });
      resetFields();
    }
  };

  return (
    <PageContainer>
      {contextHolder}
      <InterviewForm
        type={type}
        interviewInfo={interviewInfos}
        setInterviewInfo={setInterviewInfos}
        submit={handleSumit}
      />
    </PageContainer>
  );
};

export default AddInterview;
