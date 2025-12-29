export interface ICommentParams {
  currentPage: number;
  eachPage: number;
  commentContent: string;
  typeId: string;
}

export interface ICommentInfos {
  _id: string;
  userId: string; //  所属分类
  issueId: string; // 关联的模型
  bookId: string;
  typeId: string;
  issueTitle: string;
  bookName: string;
  commentContent: string; // 对应评论
  commentDate: string; // 评论日期
  commentType: number; // 评论类型
  nickname: string; // 昵称
  avatar: string; // 头像
}

export interface IResCommentInfos {
  count: number;
  currentPage: number;
  data: ICommentInfos[];
  eachPage: number;
  totalPage: number;
}
