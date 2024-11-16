import React, { useEffect, useState } from 'react';
import type { GetProp, TableProps } from 'antd';
import { Table, Input, Typography, message, Row, Col, Button } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import { EditFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from "react-icons/fa";
import { AxiosError } from 'axios';
import useDebounce from '../../hooks/useDebounce';
import { ModelResponseScheme } from '../../models/model';
import useModelService from '../../services/api/models';
import { SortOrder } from '../../utils/constraints';
import DeactivateModal from '../../components/deactivateModal';
import { ManufacturerResponseScheme } from '../../models/manufacturer';
import useManufacturerService from '../../services/api/manufacturers';

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
const ModelsPage: React.FC = () => {
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 25,
    },
    search: '',
  });
  const {getManufacturers} = useManufacturerService();
  const { getModels, deleteModel } = useModelService();
  const [data, setData] = useState<ModelResponseScheme[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelResponseScheme | null>();
  const [manufacturers, setManufacturers] = useState<ManufacturerResponseScheme[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(tableParams.search, 500);
  const navigate = useNavigate();
  const [isModalVisible, setIsModalOpen] = useState<boolean>(false);
  
  const columns: ColumnsType<ModelResponseScheme> = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      align: 'center'
    },
    {
      title: 'Model number',
      dataIndex: 'model_number',
      sorter: true,
      align: 'center'
    },
    {
      title: 'Manufacturer',
      key: 'manufacturer',
      dataIndex: ['manufacturer', 'name'],
      filters: manufacturers.map((manufacturer) => ({ text: manufacturer.name, value: manufacturer.id })), 
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          fetchManufacturers();
        }
      },
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
          onClick={() => {setSelectedModel(record); setIsModalOpen(true);}}
        />
      </div>
      ),
      align: 'center'
    }
  
  ];
  ;


  const fetchModelData = () => {
    setLoading(true);
    console.log(tableParams.filters);
    getModels({
      page: tableParams.pagination?.current, 
      page_size:tableParams.pagination?.pageSize, 
      search: debouncedSearch,
      order_by: Array.isArray(tableParams.sortField) ? tableParams.sortField.join('.') : tableParams.sortField?.toString(),
      sort_order: tableParams.sortOrder === 'descend' ? SortOrder.DESC : SortOrder.ASC,
      manufacturer_id: tableParams.filters?.manufacturer ? tableParams.filters?.manufacturer.map(String) : null
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


  const fetchManufacturers = async () => {
    try {
      const result = await getManufacturers({ 'page': 1, 'page_size': 500, search: '', order_by: 'name', sort_order: SortOrder.ASC });
      setManufacturers(result.data.data);
    } catch (error) {
      message.error('Failed to fetch manufacturers.');
    }
  };


  const handleDelete = (modelId: number) => {
    deleteModel(modelId)
      .then((response) => {
        if (!(response instanceof AxiosError)) {
          message.success('Model deleted successfully.');
          fetchModelData();
        }
        else {
          message.error(response.response?.data.msg.replace(/'/g, ""));
        }
      })
    
    setIsModalOpen(false);
    setSelectedModel(null);
    
  };

  const handleEdit = (record: ModelResponseScheme) => {
    navigate(`/models/${record.id}/edit`);
  };

  const handleTableChange: TableProps<ModelResponseScheme>['onChange'] = (pagination, filters, sorter) => {
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

  useEffect(fetchModelData, [
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
      <><Table<ModelResponseScheme>
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
          <Col flex="auto"><Text strong style={{ fontSize: '20px' }}>Models</Text></Col>
          <Col><Input
            placeholder="Search"
            value={tableParams.search}
            onChange={(e) => onSearch(e.target.value)}
            style={{ width: 150 }} /></Col>
            <Col><Button type="primary" onClick={() => navigate('/models/create')}>Create</Button></Col>
        </Row>
      )} />
            <DeactivateModal
        isModalOpen={isModalVisible}
        setIsModalOpen={setIsModalOpen}
        selectedItem={selectedModel ? selectedModel?.name : null}
        onConfirm={() => handleDelete(selectedModel!.id)}
        title='Confirm deletion'
        message='Are you sure you want to delete model'/>
      </>
  );
};

export default ModelsPage;

