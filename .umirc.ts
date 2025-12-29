import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '语林',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
      icon: 'HomeOutlined',
    },
    {
      name: '管理员',
      path: '/admin',
      icon: 'UserOutlined',
      access: 'SuperAdmin',
      routes: [
        {
          name: '管理员列表',
          path: 'adminList',
          component: './Admin',
        },
        {
          name: '添加管理员',
          path: 'addAdmin',
          component: './Admin/addAdmin',
        },
      ],
    },
    {
      name: '用户',
      path: '/user',
      icon: 'TeamOutlined',
      routes: [
        {
          name: '用户列表',
          path: 'userList',
          component: './User',
        },
        {
          name: '添加用户',
          path: 'addUser',
          component: './User/addUser',
        },
        {
          name: '编辑用户',
          path: 'editUser',
          component: './User/addUser',
          hideInMenu: true,
        },
      ],
    },
    {
      name: '书籍',
      path: '/book',
      icon: 'ReadOutlined',
      routes: [
        {
          name: '书籍列表',
          path: 'bookList',
          component: './Book',
        },
        {
          name: '添加书籍',
          path: 'addBook',
          component: './Book/addBook',
        },
        {
          name: '编辑书籍',
          path: 'editBook',
          component: './Book/addBook',
          hideInMenu: true,
        },
      ],
    },
    {
      name: '面试题',
      path: '/interview',
      icon: 'EditOutlined',
      routes: [
        {
          name: '面试题列表',
          path: 'interviewList',
          component: './Interview',
        },
        {
          name: '添加面试题',
          path: 'addInterview',
          component: './Interview/addInterview',
        },
        {
          name: '编辑面试题',
          path: 'editInterview',
          component: './Interview/addInterview',
          hideInMenu: true,
        },
      ],
    },
    {
      name: '问答',
      path: '/issue',
      component: './Issue',
      icon: 'ProfileOutlined',
    },
    {
      name: '问答详情',
      path: '/issueDetail',
      component: './Issue/issueDetail',
      hideInMenu: true,
    },
    {
      name: '评论',
      path: '/comment',
      component: './Comment',
      icon: 'CommentOutlined',
    },
    {
      name: '评论详情',
      path: '/commentDetail',
      component: './Comment/commentDetail',
      hideInMenu: true,
    },
    {
      name: '类型',
      path: '/type',
      component: './Type',
      icon: 'AppstoreOutlined',
    },
    {
      name: '登录',
      path: '/login',
      component: './Login',
      hideInMenu: true,
      menuRender: false,
    },
  ],
  proxy: {
    '/api': {
      target: 'http://localhost:7001',
      changeOrigin: true,
    },
    '/static': {
      target: 'http://localhost:7001',
      changeOrigin: true,
    },
    '/res': {
      target: 'http://localhost:7001',
      changeOrigin: true,
    },
  },
  npmClient: 'pnpm',
});
