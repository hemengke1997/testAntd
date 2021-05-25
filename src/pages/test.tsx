import React, { useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Table } from 'antd';




const dataSource = [];

// eslint-disable-next-line no-plusplus
for (let i = 1; i < 100; i++) {
  dataSource.push({
    '1': `xxxxxxxxxxxxxxxxxxxxxx${i}`,
    '2': 'xxxxxxxxxxxxxxxxxxxxxx',
    '3': 'xxxxxxxxxxxxxxxxxxxxxx',
    '4': 'xxxxxxxxxxxxxxxxxxxxxx',
    '5': 'xxxxxxxxxxxxxxxxxxxxxx',
    '6': 'xxxxxxxxxxxxxxxxxxxxxx',
    '7': 'xxxxxxxxxxxxxxxxxxxxxx',
    '8': 'xxxxxxxxxxxxxxxxxxxxxx',
    '9': 'xxxxxxxxxxxxxxxxxxxxxx',
  });
}

const List: React.FC = () => {
  const ref = useRef<ActionType>();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.ReactText[]>([]); // table 选择数据

  const columns: ProColumns<any>[] = [
    {
      title: '1',
      dataIndex: '1',
      width: 70,
    },
    {
      title: '2',
      dataIndex: '2',
      width: 140,
    },
    {
      title: '3',
      dataIndex: '4',
      width: 300,
    },
    {
      title: '4',
      dataIndex: '4',
      width: 100,
    },
    {
      title: '5',
      dataIndex: '5',
      width: 200,
    },
    {
      title: '6',
      dataIndex: '6',
      width: 140,
    },
    {
      title: '7',
      dataIndex: '7',
      width: 140,
    },
    {
      title: '8',
      dataIndex: '8',
      width: 100,
    },
    {
      title: '9',
      dataIndex: 'source',
      width: 100,
    },
  ];

  const onSelectChange = (keys: React.ReactText[]) => {
    setSelectedRowKeys(keys);
  };

  const tableWidth = columns.reduce((total, current) => {
    return total + (Number(current.width) || 120);
  }, 0);

  return (
    <>
      <ProTable
        rowKey="1"
        search={false}
        actionRef={ref}
        options={{ density: false, fullScreen: false }}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
          selections: false,
          fixed: true,
        }}
        bordered
        dataSource={dataSource}
        tableAlertRender={false}
        summary={() => (
          <Table.Summary fixed={true}>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} />
              <Table.Summary.Cell index={1} colSpan={2}>
                Summary
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} colSpan={8}>
                Content
              </Table.Summary.Cell>
              <Table.Summary.Cell index={11} colSpan={2}>
                Right
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
        columns={columns}
        sticky={{
          offsetHeader: 48
        }}
        // scroll={{ y: '66vh', x: tableWidth }}
      />
    </>
  );
};

export default List;
