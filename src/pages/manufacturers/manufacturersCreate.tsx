import React from 'react';
import { Button, Form, type FormProps, Input, Flex, Card, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import {ManufacturerCreateScheme} from '../../models/manufacturer';
import useManufacturerService from '../../services/api/manufacturers';


const t = (arg: string) => {
  return arg;
};

const ManufacturerCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { createManufacturer } = useManufacturerService();

  const onFinish: FormProps<ManufacturerCreateScheme>["onFinish"] = async (values) => {
    try {
      await createManufacturer(values);

      message.success('Manufacturer created successfully!');
      navigate(`/manufacturers`); 
    } catch (error) {
      message.error('Failed to create manufacturer.');
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
        title={'Create manufacturer'}
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
          name="createManufacturer"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<ManufacturerCreateScheme>
            label={t('Name')}
            name="name"
            rules={[{ required: true, message: 'Enter manufacturer name!' }]}
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

export default ManufacturerCreatePage;
