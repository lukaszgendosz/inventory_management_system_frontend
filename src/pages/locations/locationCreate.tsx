import React from 'react';
import { Button, Form, type FormProps, Input, Flex, Card, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import {LocationCreateScheme} from '../../models/location';
import useLocationService from '../../services/api/locations';


const t = (arg: string) => {
  return arg;
};

const LocationCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { createLocation } = useLocationService();



 

  const onFinish: FormProps<LocationCreateScheme>["onFinish"] = async (values) => {
    try {
      await createLocation(values);

      message.success('Location created successfully!');
      navigate(`/locations`); 
    } catch (error) {
      message.error('Failed to create location.');
    }
  };


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
        title={'Create location'}
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
          name="createLocation"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<LocationCreateScheme>
            label={t('Name')}
            name="name"
            rules={[{ required: true, message: 'Enter location name!' }]}
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

export default LocationCreatePage;
