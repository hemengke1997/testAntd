export default [
  {
    path: '/',
    redirect: '/test'
  },
  {
    path: '/test',
    name: 'test',
    routes: [
      {
        path: '/test',
        redirect: '/test/b'
      },
      {
        path: '/test/a',
        component: './A'
      },
      {
        path: '/test/b',
        component: './B'
      }
    ]
  },
  {
    path: '/c',
    name: 'c',
    component: './C'
  },
  {
    component: './404',
  },
];
