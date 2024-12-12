import React, { useEffect, useState } from 'react';
import { Button, Form, type FormProps, Input, Flex, Card, Select, message, Switch, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserCreateScheme } from '../../models/user';
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

const UserCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { createUser } = useUserService();
  const { getLocations } = useLocationService();
  const { getCompanies } = useCompanyService();
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

  const onFinish: FormProps<UserCreateScheme>["onFinish"] = async (values) => {
    try {
      const updatedValues = {
        ...values,
        location_id: values.location_id === 0 ? null : values.location_id,
        company_id: values.company_id === 0 ? null : values.company_id,
        department_id: values.department_id === 0 ? null : values.department_id,
      };
      const user = await createUser(updatedValues);



      message.success('User created successfully!');
      setIsFirstLoad(false)
      navigate(`/users/${user.data.id}`); 
    } catch (error) {
      message.error('Failed to create user.');
    }
  };

  const fetchLocations = async () => {
    try {
      const result = await getLocations({ 'page': 1, 'page_size': 25, search: debouncedLocationsSearch, order_by: 'name', sort_order: SortOrder.ASC });
      setLocations(result.data.data);
    } catch (error) {
      message.error('Failed to fetch locations.');
    }
  };

  const fetchCompanies = async () => {
    try {
      const result = await getCompanies({ 'page': 1, 'page_size': 25, search: debouncedCompaniesSearch, order_by: 'name', sort_order: SortOrder.ASC });
      setCompanies(result.data.data);
    } catch (error) {
      message.error('Failed to fetch companies.');
    }
  };

  const fetchDepartments = async () => {
    try {
      const result = await getDepartments({ 'page': 1, 'page_size': 25, search: debouncedDepartmentsSearch, order_by: 'name', sort_order: SortOrder.ASC });
      setDepartments(result.data.data);
    } catch (error) {
      message.error('Failed to fetch departments.');
    }
  };


  useEffect(() => {
    if (!isFirstLoad) fetchLocations();
  }, [debouncedLocationsSearch]);

  useEffect(() => {
    if (!isFirstLoad) fetchCompanies();
  }, [debouncedCompaniesSearch]);

  useEffect(() => {
    if (!isFirstLoad) fetchDepartments();
  }, [debouncedDepartmentsSearch]);
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
        title={'Create user'}
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
          name="editUser"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<UserCreateScheme>
            label={t('Email')}
            name="email"
            rules={[{ required: true, message: 'Enter email address!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<UserCreateScheme>
            label={t('First name')}
            name="first_name"
            rules={[{ required: true, message: 'Enter first name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<UserCreateScheme>
            label={t('Last name')}
            name="last_name"
            rules={[{ required: true, message: 'Enter last name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<UserCreateScheme>
            label={t('Password')}
            name="password"
            rules={[{ required: true, message: 'Enter password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<UserCreateScheme>
            label={t('Role')}
            name="role"
            initialValue={'user'}
          >
            <Select>
              <Option key="user" value="user">User</Option>
              <Option key="manager" value="manager">Manager</Option>
              <Option key="admin" value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item<UserCreateScheme>
            label={t('Location')}
            name="location_id"
          >
            <Select 
              
              showSearch={true} 
              onSearch={setLocationsSearch}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  fetchLocations();
                }
              }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              <Option key="none" value={0}>
                None
              </Option>
              {locations.map((location) => (
                <Option key={location.id} value={location.id}>
                  {location.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item<UserCreateScheme>
            label={t('Company')}
            name="company_id"
          >
            <Select 
              showSearch={true} 
              onSearch={setCompaniesSearch}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  fetchCompanies();
                }
              }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              <Option key="none" value={0}>
                None
              </Option>
              {companies.map((company) => (
                <Option key={company.id} value={company.id}>
                  {company.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item<UserCreateScheme>
            label={t('Department')}
            name="department_id"
          >
            <Select 
              
              showSearch={true} 
              onSearch={setDepartmentsSearch}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  fetchDepartments();
                }
              }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              <Option key="none" value={0}>
                None
              </Option>
              {departments.map((department) => (
                <Option key={department.id} value={department.id}>
                  {department.name}
                </Option>
              ))}
            </Select>
          </Form.Item>


          <Form.Item<UserCreateScheme>
            label={t('Notes')}
            name="notes"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item<UserCreateScheme>
            label={t('Active')}
            name="is_active"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Row justify="space-between">
              <Col><Button onClick={() => navigate('/users')}>{t('Cancel')}</Button></Col>
              <Col><Button type="primary" htmlType="submit" style={{ float: 'right' }}>{t('Submit')}</Button></Col>
            </Row>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default UserCreatePage;
