import React, { useEffect, useState } from 'react';
import type { GetProp, TableProps } from 'antd';
import { Table, Input, Modal, Typography } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import { UserResponseScheme, UsersResponseScheme } from '../models/user';
import { EditFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from "react-icons/fa";
import useDebounce from '../hooks/useDebounce';
import useUserService from '../services/api/users';
import DeleteModal from './deleteModal';


const { Text } = Typography;
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
type ColumnsType<T extends object> = TableProps<T>['columns'];


interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
  search?: string;
}
const UserTable: React.FC = () => {
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 25,
    },
    search: '',
  });
  const { getUsers } = useUserService();
  const [data, setData] = useState<UserResponseScheme[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(tableParams.search, 500);
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserResponseScheme | null>(null);

  const columns: ColumnsType<UserResponseScheme> = [
    {
      title: 'Name',
      sorter: true,
      render: (record) => (
        <a>{record.first_name} {record.last_name}</a>
      ),
      onCell: (record) => ({
        onClick: () => navigate(`/users/${record.id}`),
      }),
    },
    {
      title: 'Email',
      sorter: true,
      dataIndex: 'email',
      align: 'center'
    },
    {
      title: 'Role',
      sorter: true,
      dataIndex: 'role',
      align: 'center'
    },
    {
      title: 'Location',
      sorter: true,
      render: (record) => record.location ? record.location.name : "Not assigned",
      align: 'center'
    },
    {
      title: 'Company',
      sorter: true,
      render: (record) => record.company ? record.company.name : "Not assigned",
      align: 'center'
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      width: '7%',
      render: (record) => (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <EditFilled
          style={{ marginRight: 16, cursor: 'pointer', color: '#1668dc' }}
          onClick={() => handleEdit(record)}
        />
        <FaTrash
          style={{ cursor: 'pointer', color: '#dc4446' }}
          onClick={() => {setSelectedUser(record); setIsModalVisible(true);}}
        />
      </div>
      ),
      align: 'center'
    }
  
  ];
  ;
  const handleDelete = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };
  const handleEdit = (record: UserResponseScheme) => {
    navigate(`/users/edit/${record.id}`);
  };

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
  const fetchUsersData = () => {
    setLoading(true);
    getUsers({
      page: tableParams.pagination?.current, 
      page_size:tableParams.pagination?.pageSize, 
      search: debouncedSearch})
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
      })
      .catch((err) => {
        setLoading(false)
        console.error(err);
      })
      
  };

  useEffect(fetchUsersData, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams?.sortOrder,
    tableParams?.sortField,
    JSON.stringify(tableParams.filters),
    debouncedSearch,
  ]);

  

  const onSearch = (value: string) => {
    setTableParams((prev) => ({
      ...prev,
      search: value,
      pagination: {
        ...prev.pagination,
        current: 1, 
      },
    }));
  };

  return (
      <><Table<UserResponseScheme>
      scroll={{ y: 'calc(100vh - 297px)', x: 1000 }}
      columns={columns}
      rowKey={(record) => record.id}
      dataSource={data}
      loading={loading}
      size="middle"
      pagination={{
        current: tableParams.pagination?.current,
        pageSize: tableParams.pagination?.pageSize,
        total: tableParams.pagination?.total,
        position: ['bottomCenter'],
        pageSizeOptions: ['25', '50', '100'],
      }}
      onChange={handleTableChange}
      title={() => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text strong style={{ fontSize: '20px' }}>Users</Text>
          <Input
            placeholder="Search"
            value={tableParams.search}
            onChange={(e) => onSearch(e.target.value)}
            style={{ width: 200 }} />
        </div>
      )} />
      <DeleteModal
        isModalOpen={isModalVisible}
        setIsModalOpen={setIsModalVisible}
        selectedItem={selectedUser ? `${selectedUser?.first_name} ${selectedUser?.last_name}` : null}
        onConfirm={handleDelete}/>
      </>
  );
};

export default UserTable;

