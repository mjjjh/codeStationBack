import { IIssueInfos } from '@/services/issue/typings';
import { PageContainer } from '@ant-design/pro-components';
import { Viewer } from '@toast-ui/react-editor';
import { useLocation } from '@umijs/max';
import { Card, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const IssueDetail: React.FC = () => {
  const [issueInfos, setIssueInfos] = useState<Partial<IIssueInfos>>({});
  const editorRef = useRef<any>('');

  const location = useLocation();

  useEffect(() => {
    if (location) {
      const { state } = location as {
        state: {
          interviewInfo: IIssueInfos;
          type: 'add' | 'update' | 'detail';
        };
      };
      if (state) {
        setIssueInfos(state?.interviewInfo);
      }
    }
  }, [location]);

  useEffect(() => {
    editorRef.current.getInstance().setMarkdown(issueInfos.issueContent);
  }, [issueInfos]);
  return (
    <PageContainer>
      <Card title={issueInfos.issueTitle}>
        <div>
          <h2>提问用户</h2>
          <Tag color="orange">{issueInfos.nickname}</Tag>
        </div>
        <div style={{ marginTop: '10px' }}>
          <h2>问题描述</h2>
          <Viewer initialValue="" ref={editorRef} />
        </div>
        <div style={{ marginTop: '10px' }}>
          <h2>提问时间</h2>
          <p>{issueInfos.issueDate}</p>
        </div>
        <div style={{ marginTop: '10px' }}>
          <h2>浏览数</h2>
          <p>{issueInfos.scanNumber}</p>
        </div>
        <div style={{ marginTop: '10px' }}>
          <h2>评论数</h2>
          <p>{issueInfos.commentNumber}</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default IssueDetail;
