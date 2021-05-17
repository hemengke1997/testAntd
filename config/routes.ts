export default [
  {
    path: '/',
    redirect: '/test'
  },
  {
    path: '/test',
    name: 'test',
    component: './test'
  },
  {
    component: './404',
  },
];
