import React, { useEffect, useState } from 'react';
import type { GetProp, TableProps } from 'antd';
import { Table, Input, Typography, message, Row, Col, Button, Tooltip,Select, Modal } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import { EditFilled, LeftSquareFilled, RightSquareFilled, FileExcelOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { AssetResponseScheme, Status } from '../../models/asset';
import useAssetService from '../../services/api/assets';
import useDebounce from '../../hooks/useDebounce';
import { LocationResponseScheme } from '../../models/location';
import { CompanyResponseScheme } from '../../models/company';
import useCompanyService from '../../services/api/companies';
import useLocationService from '../../services/api/locations';
import { SortOrder } from '../../utils/constraints';
import useSupplierService from '../../services/api/suppliers';
import useModelService from '../../services/api/models';
import { ModelResponseScheme } from '../../models/model';
import { SupplierResponseScheme } from '../../models/supplier';
import useManufacturerService from '../../services/api/manufacturers';
import { ManufacturerResponseScheme } from '../../models/manufacturer';
import { UserResponseScheme } from '../../models/user';
import useUserService from '../../services/api/users';
import { ContentType } from '../../services/api/axios';
import { GrDownload } from "react-icons/gr";


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
  const { getAssets, deactivateAsset, checkoutAsset, checkinAsset, exportAssets } = useAssetService();
  const [data, setData] = useState<AssetResponseScheme[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(tableParams.search, 500);
  const navigate = useNavigate();
  const [isModalVisible, setIsModalOpen] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetResponseScheme | null>(null);
  const [locations, setLocations] = useState<LocationResponseScheme[]>([]);
  const [companies, setCompanies] = useState<CompanyResponseScheme[]>([]);
  const [models, setModels] = useState<ModelResponseScheme[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierResponseScheme[]>([]);
  const { getModels } = useModelService();
  const { getSuppliers } = useSupplierService();
  const [manufacturers, setManufacturers] = useState<ManufacturerResponseScheme[]>([]);
  const { getManufacturers } = useManufacturerService();
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'name',
    'serial_number',
    'status',
    'model',
    'manufacturer',
    'supplier',
    'checked_out_to',
    'action'
  ]);
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [users, setUsers] = useState<UserResponseScheme[]>([]);
  const [usersSearch, setUsersSearch] = useState('');
  const [assetToCheckOut, setAssetToCheckout] = useState<AssetResponseScheme | null>(null);
  const { getUsers } = useUserService();
  const debouncedUsersSearch = useDebounce(usersSearch, 250);
  const [isCheckinModalVisible, setIsCheckinModalVisible] = useState(false);
  const [assetToCheckin, setAssetToCheckin] = useState<AssetResponseScheme | null>(null);

  const allColumns = [
    { key: 'name', title: 'Name' },
    { key: 'serial_number', title: 'Serial Number' },
    { key: 'status', title: 'Status' },
    { key: 'location', title: 'Location' },
    { key: 'company', title: 'Company' },
    { key: 'model', title: 'Model' },
    { key: 'manufacturer', title: 'Manufacturer' },
    { key: 'supplier', title: 'Supplier' },
    { key: 'checked_out_to', title: 'Checked Out To' },
    { key: 'action', title: 'Action' }
  ];

  const handleColumnVisibilityChange = (checkedValues: string[]) => {
    setSelectedColumns(checkedValues);
  };


  const columns: ColumnsType<AssetResponseScheme> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      sorter: true,
      defaultSortOrder: 'ascend',
      render: (text, record) => (
        <a>{record.name}</a>
      ),
      onCell: (record) => ({
        onClick: () => navigate(`/assets/${record.id}`),
      }),
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
      dataIndex: 'status',
      
      render: (_, record) => {
        const statusKey = Object.entries(Status).find(([_, value]) => value === record.status)?.[0] || record.status;
        return statusKey;
      },
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
      title: 'Manufacturer',
      key: 'manufacturer_id',
      dataIndex: ['model', 'manufacturer', 'name'],
      align: 'center',
      filterSearch: true,
      filters: manufacturers.map((manufacturer) => ({ text: manufacturer.name, value: manufacturer.id })),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          fetchManufacturers();
        }
      }
    },
    {
      title: 'Model',
      key: 'model_id',
      dataIndex: ['model', 'name'],
      align: 'center',
      filterSearch: true,
      filters: models.map((model) => ({ text: model.name, value: model.id })),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          fetchModels();
        }
      }
    },
    {
      title: 'Supplier',
      key: 'supplier_id',
      dataIndex: ['supplier', 'name'],
      align: 'center',
      filterSearch: true,
      filters: suppliers.map((supplier) => ({ text: supplier.name, value: supplier.id })),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          fetchSuppliers();
        }
      }
    },
    {
      title: 'Checked Out To',
      key: 'checked_out_to',
      align: 'center',
      render: (_, record) => {
        if (record.status === Status.Deployed) {
          if (record.user) {
            return record.user.first_name + ' ' + record.user.last_name;
          }
        }
        return '-';
      }
    },
    {
      title: 'Action',
      key: 'action',
      width: '12%',
      render: (record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          {(record.status === Status.Available || record.status === Status.Reserved) && (
            <Tooltip title="Check out">
              <RightSquareFilled
                style={{ cursor: 'pointer', color: '#1668dc' }}
                onClick={() => handleCheckout(record)}
              />
            </Tooltip>
          )}
          {record.status === Status.Deployed && (
            <Tooltip title="Check in">
              <LeftSquareFilled
                style={{ cursor: 'pointer', color: '#1668dc' }}
                onClick={() => handleCheckin(record)}
              />
            </Tooltip>
          )}
          {![Status.Available, Status.Reserved, Status.Deployed].includes(record.status) && (
            <Tooltip title="Asset unavailable">
              <RightSquareFilled
                style={{ cursor: 'not-allowed', color: '#d9d9d9' }}
              />
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <EditFilled
              style={{ cursor: 'pointer', color: '#1668dc' }}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
        </div>
      ),
      align: 'center'
    }
  
  ];
  const visibleColumns = columns.filter(col => {
    const key = 'dataIndex' in col
      ? (Array.isArray(col.dataIndex) ? col.dataIndex[0] : col.dataIndex?.toString())
      : col.key?.toString() || '';
    return selectedColumns.includes(key ? key.toString() : '');
  });

  const fetchAssetsData = () => {
    setLoading(true);
    console.log(tableParams.sortOrder);
    getAssets({
      page: tableParams.pagination?.current, 
      page_size:tableParams.pagination?.pageSize, 
      search: debouncedSearch,
      order_by: Array.isArray(tableParams.sortField) ? tableParams.sortField.join('.') : tableParams.sortField?.toString(),
      sort_order: tableParams.sortOrder === 'descend' ? SortOrder.DESC : SortOrder.ASC,
      status: Array.isArray(tableParams.filters?.status) ? tableParams.filters?.status.map(String) : null,
      company_id: Array.isArray(tableParams.filters?.company_id) ? tableParams.filters?.company_id.map(String) : null,
      location_id: Array.isArray(tableParams.filters?.location_id) ? tableParams.filters?.location_id.map(String) : null,
      model_id: Array.isArray(tableParams.filters?.model_id) ? tableParams.filters?.model_id.map(String) : null,
      supplier_id: Array.isArray(tableParams.filters?.supplier_id) ? tableParams.filters?.supplier_id.map(String) : null,
      manufacturer_id: Array.isArray(tableParams.filters?.manufacturer_id) ? tableParams.filters?.manufacturer_id.map(String) : null,


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

  const fetchModels = async () => {
    try {
      const result = await getModels({ 'page': 1, 'page_size': 500, search: '', order_by: 'name', sort_order: SortOrder.ASC, manufacturer_id: null });
      setModels(result.data.data);
    } catch (error) {
      message.error('Failed to fetch models.');
    }
  };

  const fetchSuppliers = async () => {
    try {
      const result = await getSuppliers({ 'page': 1, 'page_size': 500, search: '', order_by: 'name', sort_order: SortOrder.ASC });
      setSuppliers(result.data.data);
    } catch (error) {
      message.error('Failed to fetch suppliers.');
    }
  };

  const fetchManufacturers = async () => {
    try {
      const result = await getManufacturers({ 'page': 1, 'page_size': 500, search: '', order_by: 'name', sort_order: SortOrder.ASC });
      setManufacturers(result.data.data);
    } catch (error) {
      message.error('Failed to fetch manufacturers.');
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

  const handleCheckout = (record: AssetResponseScheme) => {
    setAssetToCheckout(record);
    setIsCheckoutModalVisible(true);
  };

  const handleCheckin = (record: AssetResponseScheme) => {
    setAssetToCheckin(record);
    setIsCheckinModalVisible(true);
  };

  const handleCheckinConfirm = async () => {
    if (!assetToCheckin) return;

    try {
      const response = await checkinAsset(assetToCheckin.id);
      if (!(response instanceof AxiosError)) {
        message.success('Asset checked in successfully');
        setIsCheckinModalVisible(false);
        setAssetToCheckin(null);
        fetchAssetsData();
      } else {
        message.error(response.response?.data.msg || 'Failed to check in asset');
      }
    } catch (error) {
      message.error('Failed to check in asset');
    }
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

  const fetchUsers = async () => {
    try {
      const result = await getUsers({ 
        'page': 1, 
        'page_size': 25, 
        search: debouncedUsersSearch, 
        order_by: 'first_name', 
        sort_order: SortOrder.ASC 
      });
      setUsers(result.data.data);
    } catch (error) {
      message.error('Failed to fetch users.');
    }
  };

  useEffect(() => {
    if (isCheckoutModalVisible) {
      fetchUsers();
    }
  }, [debouncedUsersSearch, isCheckoutModalVisible]);

  const handleCheckoutConfirm = async () => {
    if (!selectedUser || !assetToCheckOut) return;

    try {
      const response = await checkoutAsset(assetToCheckOut.id, selectedUser);
      if (!(response instanceof AxiosError)) {
        message.success('Asset checked out successfully');
        setIsCheckoutModalVisible(false);
        setSelectedUser(null);
        setAssetToCheckout(null);
        fetchAssetsData();
      } else {
        message.error(response.response?.data.msg || 'Failed to check out asset');
      }
    } catch (error) {
      message.error('Failed to check out asset');
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportAssets(ContentType.CSV, {
        page: tableParams.pagination?.current,
        page_size: tableParams.pagination?.pageSize,
        search: debouncedSearch,
        order_by: Array.isArray(tableParams.sortField) ? tableParams.sortField.join('.') : tableParams.sortField?.toString(),
        sort_order: tableParams.sortOrder === 'descend' ? SortOrder.DESC : SortOrder.ASC,
        company_id: Array.isArray(tableParams.filters?.company_id) ? tableParams.filters?.company_id.map(String) : null,
        location_id: Array.isArray(tableParams.filters?.location_id) ? tableParams.filters?.location_id.map(String) : null,
        model_id: Array.isArray(tableParams.filters?.model_id) ? tableParams.filters?.model_id.map(String) : null,
        supplier_id: Array.isArray(tableParams.filters?.supplier_id) ? tableParams.filters?.supplier_id.map(String) : null,
        manufacturer_id: Array.isArray(tableParams.filters?.manufacturer_id) ? tableParams.filters?.manufacturer_id.map(String) : null,
      });

      if (!(response instanceof AxiosError)) {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'assets.csv');
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      } else {
        message.error('Failed to export assets');
      }
    } catch (error) {
      message.error('Failed to export assets');
    }
  };

  return (
      <><Table<AssetResponseScheme>
      scroll={{ y: 'calc(100vh - 297px)', x: 1000 }}
      columns={visibleColumns}
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
        <Row gutter={{xs: 8, sm: 16}} align="middle">
          <Col flex="auto"><Text strong style={{ fontSize: '20px' }}>Assets</Text></Col>
          <Col>
            <Input
              placeholder="Search"
              value={tableParams.search}
              onChange={(e) => onSearch(e.target.value)}
              style={{ width: 150 }}
            />
          </Col>
          <Col>
            <Select
              mode="multiple"
              value={selectedColumns}
              onChange={handleColumnVisibilityChange}
              placeholder="Columns"
              style={{ width: '120px' }}
              options={allColumns.map(col => ({
                label: col.title,
                value: col.key,
              }))}
              maxTagCount={0}
              maxTagPlaceholder={() => 'Columns'}
            />
          </Col>
          <Col>
            <Tooltip title="Export as CSV">
              <Button 
                icon={<GrDownload />}
                onClick={handleExport}
                style={{ marginRight: 8 }}
              />
            </Tooltip>
          </Col>
          <Col>
            <Button type="primary" onClick={() => navigate('/assets/create')}>
              Create
            </Button>
          </Col>
        </Row>
      )} />
      <Modal
        title="Check Out Asset"
        open={isCheckoutModalVisible}
        onOk={handleCheckoutConfirm}
        onCancel={() => {
          setIsCheckoutModalVisible(false);
          setSelectedUser(null);
          setAssetToCheckout(null);
        }}
        okButtonProps={{ disabled: !selectedUser }}
      >
        <p>Select a user to check out asset: {assetToCheckOut?.name}</p>
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Select a user"
          value={selectedUser}
          onChange={(value) => setSelectedUser(value)}
          onSearch={setUsersSearch}
          filterOption={false}
          notFoundContent={null}
        >
          {users.map((user) => (
            <Select.Option key={user.id} value={user.id}>
              {user.first_name} {user.last_name}
            </Select.Option>
          ))}
        </Select>
      </Modal>
      <Modal
        title="Check In Asset"
        open={isCheckinModalVisible}
        onOk={handleCheckinConfirm}
        onCancel={() => {
          setIsCheckinModalVisible(false);
          setAssetToCheckin(null);
        }}
        okText="Check In"
      >
        <p>Are you sure you want to check in this asset?</p>
        <p><strong>Asset:</strong> {assetToCheckin?.name}</p>
        {assetToCheckin?.user && (
          <p><strong>Currently checked out to:</strong> {assetToCheckin.user.first_name} {assetToCheckin.user.last_name}</p>
        )}
      </Modal>
    </>
  );
};

export default AssetsPage;

