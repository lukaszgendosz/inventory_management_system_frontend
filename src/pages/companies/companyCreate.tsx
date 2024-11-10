import React, { useEffect, useState } from 'react';
import { Button, Form, type FormProps, Input, Flex, Card, Select, message, Switch } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { UserCreateScheme } from '../../models/user';
import {CompanyCreateScheme} from '../../models/company';
import useUserService from '../../services/api/users';
import useLocationService from '../../services/api/locations';
import useCompanyService from '../../services/api/companies';
import useDepartmentService from '../../services/api/departments';
import { LocationResponseScheme } from '../../models/location';
import { DepartmentResponseScheme } from '../../models/department';
import { CompanyResponseScheme } from '../../models/company';
import useDebounce from '../../hooks/useDebounce';
import { SortOrder } from '../../utils/constraints';

const { Option } = Select;

const t = (arg: string) => {
  return arg;
};

const CompanyCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { createUser } = useUserService();
  const { getLocations } = useLocationService();
  const { createCompany } = useCompanyService();
  const { getDepartments } = useDepartmentService();

  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [locations, setLocations] = useState<LocationResponseScheme[]>([]);
  const [companies, setCompanies] = useState<CompanyResponseScheme[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponseScheme[]>([]);
  const [departmentsSearch, setDepartmentsSearch] = useState<string>('');
  const [companiesSearch, setCompaniesSearch] = useState<string>('');
  const [locationsSearch, setLocationsSearch] = useState<string>('');
  const debouncedDepartmentsSearch = useDebounce(departmentsSearch, 250);
  const debouncedCompaniesSearch = useDebounce(companiesSearch, 250);
  const debouncedLocationsSearch = useDebounce(locationsSearch, 250);

  const onFinish: FormProps<CompanyCreateScheme>["onFinish"] = async (values) => {
    try {
      const user = await createCompany(values);



      message.success('Company created successfully!');
      setIsFirstLoad(false)
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
            <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
              {t('Submit')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default CompanyCreatePage;
