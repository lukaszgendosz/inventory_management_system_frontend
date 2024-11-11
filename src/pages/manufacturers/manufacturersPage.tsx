import React, { useEffect, useState } from 'react';
import type { GetProp, TableProps } from 'antd';
import { Table, Input, Typography, message, Row, Col, Button } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import { EditFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from "react-icons/fa";
import { AxiosError } from 'axios';
import useDebounce from '../../hooks/useDebounce';
import { ManufacturerResponseScheme } from '../../models/manufacturer';
import useManufacturerService from '../../services/api/manufacturers';
import { SortOrder } from '../../utils/constraints';
import DeactivateModal from '../../components/deactivateModal';

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
const ManufacturersPage: React.FC = () => {
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 25,
    },
    search: '',
  });
  const { getManufacturers, deleteManufacturer } = useManufacturerService();
  const [data, setData] = useState<ManufacturerResponseScheme[]>([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState<ManufacturerResponseScheme | null>();
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(tableParams.search, 500);
  const navigate = useNavigate();
  const [isModalVisible, setIsModalOpen] = useState<boolean>(false);
  
  const columns: ColumnsType<ManufacturerResponseScheme> = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      align: 'center'
    },
    {
        title: 'Support email',
        dataIndex: 'support_email',
        sorter: true,
        align: 'center'
    },
    {
        title: 'Support phone',
        dataIndex: 'support_phone',
        sorter: true,
        align: 'center'
    },
    {
        title: 'Support URL',
        dataIndex: 'support_url',
        sorter: true,
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
          onClick={() => {setSelectedManufacturer(record); setIsModalOpen(true);}}
        />
      </div>
      ),
      align: 'center'
    }
  
  ];
  ;


  const fetchManufacturerData = () => {
    setLoading(true);
    getManufacturers({
      page: tableParams.pagination?.current, 
      page_size:tableParams.pagination?.pageSize, 
      search: debouncedSearch,
      order_by: Array.isArray(tableParams.sortField) ? tableParams.sortField.join('.') : tableParams.sortField?.toString(),
      sort_order: tableParams.sortOrder === 'descend' ? SortOrder.DESC : SortOrder.ASC,
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
      })
      .catch((err) => {
        setLoading(false)
        console.error(err);
      })
  };




  const handleDelete = (manufacturerId: number) => {
    deleteManufacturer(manufacturerId)
      .then((response) => {
        if (!(response instanceof AxiosError)) {
          message.success('Manufacturer deleted successfully.');
          fetchManufacturerData();
        }
        else {
          message.error(response.response?.data.msg.replace(/'/g, ""));
        }
      })
    
    setIsModalOpen(false);
    setSelectedManufacturer(null);
    
  };

  const handleEdit = (record: ManufacturerResponseScheme) => {
    navigate(`/manufacturers/${record.id}/edit`);
  };

  const handleTableChange: TableProps<ManufacturerResponseScheme>['onChange'] = (pagination, filters, sorter) => {
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

  useEffect(fetchManufacturerData, [
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
      <><Table<ManufacturerResponseScheme>
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
        <Row
          gutter={{xs: 8, sm: 16}}>
          <Col flex="auto"><Text strong style={{ fontSize: '20px' }}>Manufacturers</Text></Col>
          <Col><Input
            placeholder="Search"
            value={tableParams.search}
            onChange={(e) => onSearch(e.target.value)}
            style={{ width: 150 }} /></Col>
            <Col><Button type="primary" onClick={() => navigate('/manufacturers/create')}>Create</Button></Col>
        </Row>
      )} />
            <DeactivateModal
        isModalOpen={isModalVisible}
        setIsModalOpen={setIsModalOpen}
        selectedItem={selectedManufacturer ? selectedManufacturer?.name : null}
        onConfirm={() => handleDelete(selectedManufacturer!.id)}
        title='Confirm deletion'
        message='Are you sure you want to delete manufacturer'/>
      </>
  );
};

export default ManufacturersPage;

