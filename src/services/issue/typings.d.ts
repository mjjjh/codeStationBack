export interface IIssueParams {
  currentPage: number;
  eachPage: number;
  issueTitle: string;
  typeId: string;
}

export interface IIssueInfos {
  _id: string; // mongodb 自动生成的 id
  issueTitle: string; // 问答标题
  issueContent: string; // 问答内容
  issuePic: string; // 问答图片
  scanNumber: string; // 浏览次数、
  commentNumber: string; //	评论数
  issueStatus: boolean; //	问题状态
  issueDate: string; //	问题时间
  nickname: string; //	昵称
  userId: string; //	用户id
  typeId: string; //	类型
}

export interface IResIssueInfos {
  count: number;
  currentPage: number;
  data: IIssueInfos[];
  eachPage: number;
  totalPage: number;
}
