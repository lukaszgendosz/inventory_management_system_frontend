import React, { useEffect } from 'react';
import { Button, Form, type FormProps, Input, Flex, Card, message, Row, Col } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { LocationUpdateScheme } from '../../models/location';

import useLocationService from '../../services/api/locations';


const t = (arg: string) => {
  return arg;
};

const LocationEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();
  const { getLocation, updateLocation } = useLocationService();


  const onFinish: FormProps<LocationUpdateScheme>["onFinish"] = async (values) => {
    try {

      await updateLocation(Number(id), values);

      message.success('Location updated successfully!');
      navigate('/locations'); 
    } catch (error) {
      message.error('Failed to update location.');
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await getLocation(Number(id));
      const locationData = response.data;

      
      form.setFieldsValue({
        name: locationData.name,
      });

    } catch (error) {
      message.error('Failed to fetch location data.');
    }
  };



  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Flex
      style={{
        width: 'calc(100%)',
        height: 'calc(100%)',
      }}
      justify="center"
      align="top"
    >
      <Card
        title={'Edit location'}
        style={{
          width: 'calc(100%)',
          height: 'calc(100%)',
        }}
        bordered={true}
      >
        <Form
          style={{
            width: '40vw',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          name="editLocation"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >

          <Form.Item<LocationUpdateScheme>
            label={t('Name')}
            name="name"
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Row justify="space-between">
              <Col><Button onClick={() => navigate('/locations')}>{t('Cancel')}</Button></Col>
              <Col><Button type="primary" htmlType="submit" style={{ float: 'right' }}>{t('Submit')}</Button></Col>
            </Row>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default LocationEditPage;
