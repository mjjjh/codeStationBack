import { ICommentInfos } from '@/services/comment/typings';
import { PageContainer } from '@ant-design/pro-components';
import { Viewer } from '@toast-ui/react-editor';
import { useLocation } from '@umijs/max';
import { Card, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const CommentDetail: React.FC = () => {
  const [commentInfos, setCommentInfos] = useState<Partial<ICommentInfos>>({});
  const editorRef = useRef<any>('');

  const location = useLocation();

  useEffect(() => {
    if (location) {
      const { state } = location as {
        state: {
          interviewInfo: ICommentInfos;
          type: 'add' | 'update' | 'detail';
        };
      };
      if (state) {
        setCommentInfos(state?.interviewInfo);
      }
    }
  }, [location]);

  useEffect(() => {
    editorRef.current.getInstance().setMarkdown(commentInfos.commentContent);
  }, [commentInfos]);
  return (
    <PageContainer>
      <Card title={commentInfos.issueTitle}>
        <div>
          <h2>提问用户</h2>
          <Tag color="orange">{commentInfos.nickname}</Tag>
        </div>
        <div style={{ marginTop: '10px' }}>
          <h2>问题描述</h2>
          <Viewer initialValue="" ref={editorRef} />
        </div>
        <div style={{ marginTop: '10px' }}>
          <h2>评论时间</h2>
          <p>{commentInfos.commentDate}</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default CommentDetail;
