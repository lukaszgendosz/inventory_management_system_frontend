import React from 'react';
import { Button, Form, type FormProps, Input, Flex, Card, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import {CompanyCreateScheme} from '../../models/company';
import useCompanyService from '../../services/api/companies';


const t = (arg: string) => {
  return arg;
};

const CompanyCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { createCompany } = useCompanyService();



 

  const onFinish: FormProps<CompanyCreateScheme>["onFinish"] = async (values) => {
    try {
      await createCompany(values);

      message.success('Company created successfully!');
      navigate(`/companies`); 
    } catch (error) {
      message.error('Failed to create company.');
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
        title={'Create company'}
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
          name="createCompany"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<CompanyCreateScheme>
            label={t('Name')}
            name="name"
            rules={[{ required: true, message: 'Enter company name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Row justify="space-between">
              <Col><Button onClick={() => navigate('/companies')}>{t('Cancel')}</Button></Col>
              <Col><Button type="primary" htmlType="submit" style={{ float: 'right' }}>{t('Submit')}</Button></Col>
          </Row>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default CompanyCreatePage;
