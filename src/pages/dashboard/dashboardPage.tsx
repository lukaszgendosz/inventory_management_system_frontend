import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Spin } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AssetResponseScheme, Status } from '../../models/asset';
import useAssetService from '../../services/api/assets';
import useUserService from '../../services/api/users';
import useCompanyService from '../../services/api/companies';
import useLocationService from '../../services/api/locations';
import useModelService from '../../services/api/models';
import useManufacturerService from '../../services/api/manufacturers';
import { SortOrder } from '../../utils/constraints';

const { Title } = Typography;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface AssetStatusCount {
  name: string;
  value: number;
}

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalUsers: 0,
    totalCompanies: 0,
    totalLocations: 0,
    totalModels: 0,
    totalManufacturers: 0
  });
  const [statusCounts, setStatusCounts] = useState<AssetStatusCount[]>([]);
  const [recentAssets, setRecentAssets] = useState<AssetResponseScheme[]>([]);
  
  const { getAssets } = useAssetService();
  const { getUsers } = useUserService();
  const { getCompanies } = useCompanyService();
  const { getLocations } = useLocationService();
  const { getModels } = useModelService();
  const { getManufacturers } = useManufacturerService();

  const fetchDashboardData = async () => {
    try {
      const [
        assetsResponse, 
        usersResponse, 
        companiesResponse, 
        locationsResponse,
        modelsResponse,
        manufacturersResponse
      ] = await Promise.all([
        getAssets({
          page: 1,
          page_size: 500,
          search: '',
          order_by: 'created_at',
          sort_order: SortOrder.DESC,
        }),
        getUsers({ page: 1, page_size: 500, search: '', order_by: 'created_at', sort_order: SortOrder.DESC }),
        getCompanies({ page: 1, page_size: 500, search: '', order_by: 'created_at', sort_order: SortOrder.DESC }),
        getLocations({ page: 1, page_size: 500, search: '', order_by: 'created_at', sort_order: SortOrder.DESC }),
        getModels({ page: 1, page_size: 500, search: '', order_by: 'created_at', sort_order: SortOrder.DESC, manufacturer_id: null }),
        getManufacturers({ page: 1, page_size: 500, search: '', order_by: 'created_at', sort_order: SortOrder.DESC })
      ]);

      const assets = assetsResponse.data.data;
      
      setStats({
        totalAssets: assets.length,
        totalUsers: usersResponse.data.data.length,
        totalCompanies: companiesResponse.data.data.length,
        totalLocations: locationsResponse.data.data.length,
        totalModels: modelsResponse.data.data.length,
        totalManufacturers: manufacturersResponse.data.data.length
      });

      const counts = Object.values(Status).reduce((acc, status) => {
        const count = assets.filter(asset => asset.status === status).length;
        if (count > 0) {
          acc.push({ name: status, value: count });
        }
        return acc;
      }, [] as AssetStatusCount[]);
      
      setStatusCounts(counts);
      setRecentAssets(assets.slice(0, 7));
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const recentColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center'
    },
    {
      title: 'Manufacturer',
      dataIndex: ['model', 'manufacturer', 'name'],
      key: 'manufacturer',
      align: 'center'
    },
    {
      title: 'Model',
      dataIndex: ['model', 'name'],
      key: 'model',
      align: 'center'
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Dashboard</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} xl={4}>
          <Card>
            <Statistic 
              title="Total Assets" 
              value={stats.totalAssets} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} xl={4}>
          <Card>
            <Statistic 
              title="Total Users" 
              value={stats.totalUsers}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} xl={4}>
          <Card>
            <Statistic 
              title="Total Companies" 
              value={stats.totalCompanies}
              valueStyle={{ color: '#1668dc' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} xl={4}>
          <Card>
            <Statistic 
              title="Total Locations" 
              value={stats.totalLocations}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} xl={4}>
          <Card>
            <Statistic 
              title="Total Models" 
              value={stats.totalModels}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} xl={4}>
          <Card>
            <Statistic 
              title="Total Manufacturers" 
              value={stats.totalManufacturers}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Asset Status Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusCounts}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => 
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusCounts.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} assets`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Recently Added Assets" style={{ height: '405px' }}>
            <Table
              dataSource={recentAssets}
              columns={recentColumns}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage; 