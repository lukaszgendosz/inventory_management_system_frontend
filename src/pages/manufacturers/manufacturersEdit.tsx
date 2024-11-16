import React, { useEffect } from 'react';
import { Button, Form, type FormProps, Input, Flex, Card, message, Row, Col } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ManufacturerUpdateScheme } from '../../models/manufacturer';

import useManufacturerService from '../../services/api/manufacturers';


const t = (arg: string) => {
  return arg;
};

const ManufacturerEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();
  const { getManufacturer, updateManufacturer } = useManufacturerService();


  const onFinish: FormProps<ManufacturerUpdateScheme>["onFinish"] = async (values) => {
    try {

      await updateManufacturer(Number(id), values);

      message.success('Manufacturer updated successfully!');
      navigate('/manufacturers'); 
    } catch (error) {
      message.error('Failed to update manufacturer.');
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await getManufacturer(Number(id));
      const manufacturerData = response.data;

      
      form.setFieldsValue({
        name: manufacturerData.name,
        support_url: manufacturerData.support_url,
        support_phone: manufacturerData.support_phone,
        support_email: manufacturerData.support_email
      });

    } catch (error) {
      message.error('Failed to fetch manufacturer data.');
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
        title={'Edit manufacturer'}
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
          name="editManufacturer"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >

          <Form.Item<ManufacturerUpdateScheme>
            label={t('Name')}
            name="name"
          >
            <Input />
          </Form.Item>

          <Form.Item<ManufacturerUpdateScheme>
            label={t('Support URL')}
            name="support_url"
          >
            <Input />
          </Form.Item>
          
          <Form.Item<ManufacturerUpdateScheme>
            label={t('Support phone')}
            name="support_phone"
          >
            <Input />
          </Form.Item>

          <Form.Item<ManufacturerUpdateScheme>
            label={t('Support email')}
            name="support_email"
          >
            <Input />
          </Form.Item>
          

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Row justify="space-between">
              <Col><Button onClick={() => navigate('/manufacturers')}>{t('Cancel')}</Button></Col>
              <Col><Button type="primary" htmlType="submit" style={{ float: 'right' }}>{t('Submit')}</Button></Col>
            </Row>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default ManufacturerEditPage;
