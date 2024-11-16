// UserDetails.tsx

import React, { useEffect } from 'react';
import { Button, Card, Col, Descriptions, message, Row, Tag, Typography } from 'antd';
import { UserResponseScheme } from '../../models/user';
import { CompanyResponseScheme } from '../../models/company';
import { LocationResponseScheme } from '../../models/location';
import { DepartmentResponseScheme } from '../../models/department';
import useUserService from '../../services/api/users';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Title } = Typography;


const renderDescriptionItem = (label: string, value: React.ReactNode) => (
  <Descriptions.Item span={1} label={label}>{value} </Descriptions.Item>
);


const UserDetails: React.FC = () => {
  const {auth} = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUser } = useUserService();
  const [user, setUser] = React.useState<UserResponseScheme | null>(null);
  const renderActiveStatus = (isActive: boolean | undefined) => {
    return isActive ? (
      <Tag color="green">Active</Tag>
    ) : (
      <Tag color="red">Inactive</Tag>
    );
  };

  const fetchUserData = async () => {
    try {
      let userData: UserResponseScheme | null = null;
      if (id === undefined) {
        userData = auth.current_user ? auth.current_user : null;
        console.log(userData)
      } else {
        const response = await getUser(Number(id));
        userData = response.data;
      }
      console.log(userData, id);
      setUser(userData);

    } catch (error) {
      message.error('Failed to fetch user data.');
    }
  };

  useEffect(() => {
    fetchUserData()
  },[]
  );

  return (
    <Card
      title={<Title level={4}>User Details</Title>}
      bordered={false}
      style={{ width: '100%', height: '100%',margin: '0 auto' }}
    >
      <Row gutter={[16, 16]}>
      <Col xs={24} md={16} lg={16} style={{maxWidth: '25%'}} offset={10}>
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
          {renderDescriptionItem('Notes', user?.notes)}
        </Descriptions>
        </Col>
        
        <Col span={1} offset={0}>
            <Button type="primary" onClick={() => navigate(`/users/${id}/edit`)} block>
              Edit
            </Button>
        </Col>
      </Row>
      <Row>
        <Button style={{ marginTop: '20px', maxWidth: '100px'}} type="primary" onClick={() => navigate('/users')} block>
          Back
        </Button>
      </Row>
    </Card>
  );
};

export default UserDetails;
