// UserDetails.tsx

import React, { useEffect } from 'react';
import { Button, Card, Col, Descriptions, message, Row, Space, Tag, Typography } from 'antd';
import { UserResponseScheme } from '../../models/user';
import { CompanyResponseScheme } from '../../models/company';
import { LocationResponseScheme } from '../../models/location';
import { DepartmentResponseScheme } from '../../models/department';
import { Role } from '../../models/user';
import useUserService from '../../services/api/users';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Paragraph } = Typography;


const renderDescriptionItem = (label: string, value: React.ReactNode) => (
  <Descriptions.Item label={label}>{value}</Descriptions.Item>
);


const UserDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUser } = useUserService();
  const [user, setUser] = React.useState<UserResponseScheme | null>(null);
  const renderActiveStatus = (isActive: boolean) => {
    return isActive ? (
      <Tag color="green">Active</Tag>
    ) : (
      <Tag color="red">Inactive</Tag>
    );
  };

  const fetchUserData = async () => {
    try {
      const response = await getUser(Number(id));
      const userData = response.data;
      setUser(userData);

    } catch (error) {
      message.error('Failed to fetch user data.');
    }
  };

useEffect(() => {
  fetchUserData(),
  []
})

  return (
    <Card
      title={<Title level={4}>User Details</Title>}
      bordered={false}
      style={{ width: '100%', height: '100%',margin: '0 auto' }}
    >
      <Row gutter={[16, 16]} justify="center">
      <Col xs={24} md={16} lg={16} style={{maxWidth: '60%'}}>
        <Descriptions
          
          bordered
          column={1}
          size="default"
          layout="horizontal"
        >
          {renderDescriptionItem('Email', user?.email)}
          {renderDescriptionItem('First Name', user?.first_name)}
          {renderDescriptionItem('Last Name', user?.last_name)}
          {renderDescriptionItem('Role', user?.role)}
          {user?.notes && renderDescriptionItem('Notes', user?.notes)}
          {renderDescriptionItem(
            'Company',
            user?.company ? (user?.company as CompanyResponseScheme).name : 'N/A'
          )}
          {renderDescriptionItem(
            'Location',
            user?.location ? (user?.location as LocationResponseScheme).name : 'N/A'
          )}
          {renderDescriptionItem(
            'Department',
            user?.department ? (user?.department as DepartmentResponseScheme).name : 'N/A'
          )}
          {renderDescriptionItem('Status', renderActiveStatus(user?.is_active))}
        </Descriptions>
        </Col>
        
        <Col>
        <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => navigate(`/users/${id}/edit`)} block>
              Edit
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default UserDetails;
