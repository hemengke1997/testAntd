import { Link } from 'umi';
import ProTable from '@ant-design/pro-table';
import './index.module.less';

const B = () => {
  const columns = [
    {
      dataIndex: 'a',
      title: '测试1',
      ellipsis: true,
      width: 120,
    },
    {
      dataIndex: 'b',
      title: '测试2',
    },
  ];
  const dataSource = [
    {
      a: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      b: 'xxxxxxxxxxxxxxxxxxx',
    },
    {
      a: 'mmmmmmmm',
      b: 'yyyyyyyyyyyyyyyyy',
    },
  ];

  return (
    <div>
      <ProTable columns={columns} dataSource={dataSource}></ProTable>
    </div>
  );
};

export default B;
