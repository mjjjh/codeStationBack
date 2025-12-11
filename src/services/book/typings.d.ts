export interface IBookParams {
  currentPage: number;
  eachPage: number;
  bookTitle: string;
  typeId: string;
}

export interface IBookInfos {
  _id: string; // mongodb 自动生成的 id
  bookTitle: string; // 书籍标题
  bookPic: string; // 书籍图片
  downloadLink: string; // 下载链接
  bookIntro: string; // 书籍介绍
  scanNumber: number; // 浏览数
  commentNumber: number; // 评论数
  onShelfDate: string; // 上架日期
  requirePoints: number; // 下载所需积分
  typeId: string; // 书籍类型
}

export interface IResBookInfos {
  count: number;
  currentPage: number;
  data: IBookInfos[];
  eachPage: number;
  totalPage: number;
}
