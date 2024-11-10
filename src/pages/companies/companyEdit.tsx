import React, { useEffect } from 'react';
import { Button, Form, type FormProps, Input, Flex, Card, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { CompanyUpdateScheme } from '../../models/company';

import useCompanyService from '../../services/api/companies';


const t = (arg: string) => {
  return arg;
};

const CompanyEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();
  const { getCompany, updateCompany } = useCompanyService();


  const onFinish: FormProps<CompanyUpdateScheme>["onFinish"] = async (values) => {
    try {

      await updateCompany(Number(id), values);

      message.success('Company updated successfully!');
      navigate('/companies'); 
    } catch (error) {
      message.error('Failed to update company.');
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await getCompany(Number(id));
      const companyData = response.data;

      
      form.setFieldsValue({
        name: companyData.name,
      });

    } catch (error) {
      message.error('Failed to fetch company data.');
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
        title={'Edit company'}
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
          name="editCompany"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >

          <Form.Item<CompanyUpdateScheme>
            label={t('Name')}
            name="name"
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
              {t('Submit')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default CompanyEditPage;
