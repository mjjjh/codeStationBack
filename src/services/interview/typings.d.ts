export interface IInterviewParams {
  currentPage: number;
  eachPage: number;
  interviewTitle: string;
  typeId: string;
}

export interface IInterviewInfos {
  _id: string; // mongodb 自动生成的 id
  interviewTitle: string; // 面试标题
  interviewContent: string; // 面试内容
  onShelfDate: string; // 上架日期
  typeId: string; // 面试类型
}

export interface IResInterviewInfos {
  count: number;
  currentPage: number;
  data: IInterviewInfos[];
  eachPage: number;
  totalPage: number;
}
