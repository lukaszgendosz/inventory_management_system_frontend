import React from 'react';
import { Button, Form, type FormProps, Input, Flex, Card, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import {SupplierCreateScheme} from '../../models/supplier';
import useSupplierService from '../../services/api/suppliers';


const t = (arg: string) => {
  return arg;
};

const SupplierCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { createSupplier } = useSupplierService();

  const onFinish: FormProps<SupplierCreateScheme>["onFinish"] = async (values) => {
    try {
      await createSupplier(values);

      message.success('Supplier created successfully!');
      navigate(`/suppliers`); 
    } catch (error) {
      message.error('Failed to create supplier.');
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
        title={'Create supplier'}
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
          name="createSupplier"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<SupplierCreateScheme>
            label={t('Name')}
            name="name"
            rules={[{ required: true, message: 'Enter supplier name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<SupplierCreateScheme>
            label={t('Support URL')}
            name="support_url"
          >
            <Input />
          </Form.Item>
          
          <Form.Item<SupplierCreateScheme>
            label={t('Support phone')}
            name="support_phone"
          >
            <Input />
          </Form.Item>

          <Form.Item<SupplierCreateScheme>
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

export default SupplierCreatePage;
