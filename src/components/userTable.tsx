import React, { useEffect, useState } from 'react';
import type { GetProp, TableProps } from 'antd';
import { Pagination, Table, Input, Select } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { UserResponseScheme, PaginationResponseSchemeUserResponseScheme } from '../models/user';
import { ContentType } from '../services/api/axios';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
type ColumnsType<T extends object> = TableProps<T>['columns'];


interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
  search?: string;
}

const columns: ColumnsType<UserResponseScheme> = [
  {
    title: 'Name',
    sorter: true,
    render: (record) => (
      <a href={`/users/${record.id}`} >
        {record.first_name} {record.last_name}
      </a>
    ),
  },
  {
    title: 'Email',
    sorter: true,
    dataIndex: 'email',
  },
  {
    title: 'Role',
    sorter: true,
    dataIndex: 'role',
  },
  {
    title: 'Location',
    sorter: true,
    dataIndex: 'location',
  },
  {
    title: 'Company',
    sorter: true,
    dataIndex: 'company.name',
  },
];

const UserTable: React.FC = () => {
  const [data, setData] = useState<UserResponseScheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 25,
    },
    search: '',
  });
  const axiosPrivate = useAxiosPrivate();

  const getUsers = () => {
    setLoading(true);
    axiosPrivate<PaginationResponseSchemeUserResponseScheme>({
      url: '/api/v1/users',
      method: 'GET',
      headers: {
        'Content-Type': ContentType.Json,
      },
      params: {
        page: tableParams.pagination?.current,
        page_size: tableParams.pagination?.pageSize,
        search: tableParams.search,
      },
    })
      .then((results) => results.data)
      .then(({ total_pages, data }) => {
        setData(data);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: (tableParams.pagination?.pageSize ?? 0) * total_pages,
          },
        });
      });
  };

  useEffect(getUsers, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams?.sortOrder,
    tableParams?.sortField,
    JSON.stringify(tableParams.filters),
    tableParams.search,
  ]);

  const handleTableChange: TableProps<UserResponseScheme>['onChange'] = (pagination, filters, sorter) => {
    setTableParams((prevTableParams) => ({
      ...prevTableParams,
      pagination: {
        ...prevTableParams.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    }));
  };

  const onSearch = (value: string) => {
    setTableParams({
      ...tableParams,
      search: value,
    });
  };

  return (
    <div>
      <Table<UserResponseScheme>
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        loading={loading}
        pagination={{ 
          current: tableParams.pagination?.current,
          pageSize: tableParams.pagination?.pageSize,
          total: tableParams.pagination?.total,
          position: ['bottomCenter'],
          pageSizeOptions: ['25', '50', '100'],
        }}
        onChange={handleTableChange}
        title={() => (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Input
              placeholder="Search"
              value={tableParams.search}
              onChange={(e) => onSearch(e.target.value)}
              style={{ width: 200 }}
            />
          </div>
        )}
      />
    </div>
  );
};

export default UserTable;

