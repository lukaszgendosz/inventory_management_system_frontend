// UserDetails.tsx

import React, { useEffect } from 'react';
import { Card, Descriptions, Tag, Tabs, Row, Col, Typography, Table, Space, Button, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useUserService from '../../services/api/users';
import { UserResponseScheme } from '../../models/user';
import type { TabsProps } from 'antd';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { AssetResponseScheme } from '../../models/asset';
import useAssetService from '../../services/api/assets';
import { SortOrder } from '../../utils/constraints';

const { Title } = Typography;

const UserDetails: React.FC = () => {
  const { auth } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUser } = useUserService();
  const { getAssets, getCurrentUserAssets } = useAssetService();
  const [user, setUser] = React.useState<UserResponseScheme | null>(null);
  const [userAssets, setUserAssets] = React.useState<AssetResponseScheme[]>([]);
  const [loading, setLoading] = React.useState(true);

  const renderActiveStatus = (isActive: boolean | undefined) => {
    return isActive ? (
      <Tag color="green">Active</Tag>
    ) : (
      <Tag color="red">Inactive</Tag>
    );
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      let userData: UserResponseScheme | null = null;
      if (id === undefined) {
        userData = auth.current_user ? auth.current_user : null;
      } else {
        const response = await getUser(Number(id));
        userData = response.data;
      }
      setUser(userData);

      if (id === undefined) {
        const assetsResponse = await getCurrentUserAssets();
        setUserAssets(assetsResponse.data);
    } else {
      const response = await getUser(Number(id));
      userData = response.data;
      
      if (userData) {
        const assetsResponse = await getAssets({
          page: 1,
          page_size: 500,
          search: '',
          order_by: 'created_at',
          sort_order: SortOrder.DESC,
          user_id: [String(userData.id)]
        });
        setUserAssets(assetsResponse.data.data);
        }
      }
    } catch (error) {
      message.error('Failed to fetch user data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const assetColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Serial Number',
      dataIndex: 'serial_number',
      key: 'serial_number',
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag>{status}</Tag>,
      align: 'center',
    },
    {
      title: 'Manufacturer',
      dataIndex: ['model', 'manufacturer', 'name'],
      key: 'manufacturer',
      align: 'center',
    },
    {
      title: 'Model',
      dataIndex: ['model', 'name'],
      key: 'model',
      align: 'center',
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Info',
      children: (
        <Descriptions bordered column={1} labelStyle={{ width: '20vw' }}>
          <Descriptions.Item label="Email">
            {user?.email}
          </Descriptions.Item>
          <Descriptions.Item label="First Name">
            {user?.first_name}
          </Descriptions.Item>
          <Descriptions.Item label="Last Name">
            {user?.last_name}
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag color="blue">{user?.role}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Company">
            {user?.company?.name || 'Not assigned'}
          </Descriptions.Item>
          <Descriptions.Item label="Department">
            {user?.department?.name || 'Not assigned'}
          </Descriptions.Item>
          <Descriptions.Item label="Location">
            {user?.location?.name || 'Not assigned'}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {renderActiveStatus(user?.is_active)}
          </Descriptions.Item>
          <Descriptions.Item label="Notes">
            {user?.notes || 'No notes'}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: '2',
      label: 'Assets',
      children: (
        <Table 
          dataSource={userAssets} 
          columns={assetColumns} 
          rowKey="id"
          pagination={false}
        />
      ),
    },
  ];

  return (
    <Card
      loading={loading}
      title={
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              {!location.pathname.startsWith('/me') && (
                <Button 
                  icon={<ArrowLeftOutlined />} 
                  onClick={() => navigate('/users')}
                />
              )}
              <Title level={4} style={{ margin: 0 }}>User Details</Title>
            </Space>
          </Col>
          <Col>
            {auth.current_user?.role === 'admin' && (
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => navigate(`/users/${user?.id}/edit`)}
              >
                Edit
              </Button>
            )}
          </Col>
        </Row>
      }
      style={{ width: '100%', height: '100%' }}
    >
      <Tabs defaultActiveKey="1" items={items} />
    </Card>
  );
};

export default UserDetails;
