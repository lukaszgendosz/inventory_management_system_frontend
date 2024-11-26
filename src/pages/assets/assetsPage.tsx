import React, { useEffect, useState } from 'react';
import type { GetProp, TableProps } from 'antd';
import { Table, Input, Typography, message, Row, Col, Button } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import { EditFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { FaArchive } from "react-icons/fa";
import { AxiosError } from 'axios';
import { AssetResponseScheme, Status } from '../../models/asset';
import useAssetService from '../../services/api/assets';
import useDebounce from '../../hooks/useDebounce';
import DeactivateModal from '../../components/deactivateModal';
import { LocationResponseScheme } from '../../models/location';
import { CompanyResponseScheme } from '../../models/company';
import useCompanyService from '../../services/api/companies';
import useLocationService from '../../services/api/locations';
import { SortOrder } from '../../utils/constraints';

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
const AssetsPage: React.FC = () => {
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 25,
    },
    search: '',
    sortField: 'name',
    sortOrder: 'ascend',
    filters: {is_active: [true]},
  });
  const { getCompanies } = useCompanyService();
  const { getLocations } = useLocationService();
  const { getAssets, deactivateAsset } = useAssetService();
  const [data, setData] = useState<AssetResponseScheme[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(tableParams.search, 500);
  const navigate = useNavigate();
  const [isModalVisible, setIsModalOpen] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetResponseScheme | null>(null);
  const [locations, setLocations] = useState<LocationResponseScheme[]>([]);
  const [companies, setCompanies] = useState<CompanyResponseScheme[]>([]);


  const columns: ColumnsType<AssetResponseScheme> = [
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
      sorter: true,
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Serial Number',
      dataIndex: 'serial_number',
      sorter: true,
      align: 'center'
    },
    {
      title: 'Status',
      sorter: true,
      key: 'status',
      render: (record) => record.status,
      align: 'center',
      filters: Object.entries(Status).map(([key, value]) => ({ text: key, value: value })),
    },
    {
      title: 'Location',
      key: 'location_id',
      dataIndex: ['location', 'name'],
      align: 'center',
      filterSearch: true,
      filters: locations.map((location) => ({ text: location.name, value: location.id })),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          fetchLocations();
        }
      }
    },
    {
      title: 'Company',
      key: 'company_id',
      dataIndex: ['company', 'name'],
      align: 'center',
      filterSearch: true,
      
      filters: companies.map((company) => ({ text: company.name, value: company.id })),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          fetchCompanies();
        }
      }
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
        <FaArchive
          style={{ cursor: 'pointer', color: '#dc4446' }}
          onClick={() => {setSelectedAsset(record); setIsModalOpen(true);}}
        />
      </div>
      ),
      align: 'center'
    }
  
  ];
  ;

  const fetchAssetsData = () => {
    setLoading(true);
    console.log(tableParams.filters);
    getAssets({
      page: tableParams.pagination?.current, 
      page_size:tableParams.pagination?.pageSize, 
      search: debouncedSearch,
      order_by: Array.isArray(tableParams.sortField) ? tableParams.sortField.join('.') : tableParams.sortField?.toString(),
      sort_order: tableParams.sortOrder === 'descend' ? SortOrder.DESC : SortOrder.ASC,
      company_id: Array.isArray(tableParams.filters?.company_id) ? tableParams.filters?.company_id.map(String) : null,
      location_id: Array.isArray(tableParams.filters?.location_id) ? tableParams.filters?.location_id.map(String) : null


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

  const fetchLocations = async () => {
    try {
      const result = await getLocations({ 'page': 1, 'page_size': 500, search: '', order_by: 'name', sort_order: SortOrder.ASC });
      setLocations(result.data.data);
    } catch (error) {
      message.error('Failed to fetch locations.');
    }
  };

  const fetchCompanies = async () => {
    try {
      const result = await getCompanies({ 'page': 1, 'page_size': 500, search: '', order_by: 'name', sort_order: SortOrder.ASC });
      setCompanies(result.data.data);
    } catch (error) {
      message.error('Failed to fetch companies.');
    }
  };
  const handleDelete = (assetID: number) => {
    deactivateAsset(assetID)
      .then((response) => {
        if (!(response instanceof AxiosError)) {
          console.log('Asset deactivated');
          fetchAssetsData();
        }
        else {
          console.error(response.response?.data.msg);
        }
      })
    
    setIsModalOpen(false);
    setSelectedAsset(null);
    
  };

  const handleEdit = (record: AssetResponseScheme) => {
    navigate(`/assets/${record.id}/edit`);
  };

  const handleTableChange: TableProps<AssetResponseScheme>['onChange'] = (pagination, filters, sorter) => {
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

  useEffect(fetchAssetsData, [
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
      <><Table<AssetResponseScheme>
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
        pageSizeOptions: ['25', '50', '100', '200'],
      }}
      onChange={handleTableChange}
      title={() => (
        <Row
          gutter={{xs: 8, sm: 16}}>
          <Col flex="auto"><Text strong style={{ fontSize: '20px' }}>Assets</Text></Col>
          <Col><Input
            placeholder="Search"
            value={tableParams.search}
            onChange={(e) => onSearch(e.target.value)}
            style={{ width: 150 }} /></Col>
            <Col><Button type="primary" onClick={() => navigate('/assets/create')}>Create</Button></Col>
        </Row>
      )} />
      <DeactivateModal
        isModalOpen={isModalVisible}
        setIsModalOpen={setIsModalOpen}
        selectedItem={selectedAsset ? selectedAsset.serial_number : null}
        onConfirm={() => handleDelete(selectedAsset!.id)}
        title='Confirm deactivation'
        message='Are you sure you want to deactivate'/>
      </>
  );
};

export default AssetsPage;

