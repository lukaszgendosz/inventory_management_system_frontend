import React, { useEffect } from 'react';
import { Button, Form, type FormProps, Input, Flex, Card, message, Row, Col } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { SupplierUpdateScheme } from '../../models/supplier';

import useSupplierService from '../../services/api/suppliers';


const t = (arg: string) => {
  return arg;
};

const SupplierEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();
  const { getSupplier, updateSupplier } = useSupplierService();


  const onFinish: FormProps<SupplierUpdateScheme>["onFinish"] = async (values) => {
    try {

      await updateSupplier(Number(id), values);

      message.success('Supplier updated successfully!');
      navigate('/suppliers'); 
    } catch (error) {
      message.error('Failed to update supplier.');
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await getSupplier(Number(id));
      const supplierData = response.data;

      
      form.setFieldsValue({
        name: supplierData.name,
        support_url: supplierData.support_url,
        support_phone: supplierData.support_phone,
        support_email: supplierData.support_email
      });

    } catch (error) {
      message.error('Failed to fetch supplier data.');
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
        title={'Edit supplier'}
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
          name="editSupplier"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >

          <Form.Item<SupplierUpdateScheme>
            label={t('Name')}
            name="name"
          >
            <Input />
          </Form.Item>

          <Form.Item<SupplierUpdateScheme>
            label={t('Support URL')}
            name="support_url"
          >
            <Input />
          </Form.Item>
          
          <Form.Item<SupplierUpdateScheme>
            label={t('Support phone')}
            name="support_phone"
          >
            <Input />
          </Form.Item>

          <Form.Item<SupplierUpdateScheme>
            label={t('Support email')}
            name="support_email"
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Row justify="space-between">
              <Col><Button onClick={() => navigate('/suppliers')}>{t('Cancel')}</Button></Col>
              <Col><Button type="primary" htmlType="submit" style={{ float: 'right' }}>{t('Submit')}</Button></Col>
            </Row>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default SupplierEditPage;
