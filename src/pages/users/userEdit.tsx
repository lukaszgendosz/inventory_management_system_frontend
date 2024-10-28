import React, { useEffect, useState } from 'react';
import { Button, Form, type FormProps, Input, Flex, Card, Select, message, Switch } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { UserResponseScheme, UserUpdateScheme } from '../../models/user';
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

const UserEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();
  const { getUser, updateUser, deactivateUser, activateUser } = useUserService();
  const { getLocations } = useLocationService();
  const { getCompanies } = useCompanyService();
  const { getDepartments } = useDepartmentService();

  const [user, setUser] = useState<UserResponseScheme>();
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

  const onFinish: FormProps<UserUpdateScheme>["onFinish"] = async (values) => {
    try {
      const { is_active, ...restValues } = values;
      const updatedValues = {
        ...restValues,
        location_id: restValues.location_id === 0 ? null : restValues.location_id,
        company_id: restValues.company_id === 0 ? null : restValues.company_id,
        department_id: restValues.department_id === 0 ? null : restValues.department_id,
      };

      await updateUser(Number(id), updatedValues);
      if (is_active && is_active !== user?.is_active) {
        await activateUser(Number(id));
      }
      if (!is_active && is_active !== user?.is_active) {
        await deactivateUser(Number(id));
      }

      message.success('User updated successfully!');
      navigate('/users'); 
    } catch (error) {
      message.error('Failed to update user.');
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await getUser(Number(id));
      const userData = response.data;
      setUser(userData);

      
      form.setFieldsValue({
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        notes: userData.notes,
        location_id: userData.location?.id ?? 0,
        company_id: userData.company?.id ?? 0,
        department_id: userData.department?.id ?? 0,
        is_active: userData.is_active !== undefined ? userData.is_active : true,
      });

      if (userData.location?.id && userData.location?.name) {
        setLocations([userData.location]);
      }

      if (userData.company?.id && userData.company?.name) {
        setCompanies([userData.company]);
      }

      if (userData.department?.id && userData.department?.name) {
        setDepartments([userData.department]);
      }
      setIsFirstLoad(false);
    } catch (error) {
      message.error('Failed to fetch user data.');
    }
  };
  const fetchLocations = async () => {
    try {
      const result = await getLocations({ 'page': 1, 'page_size': 25, search: debouncedLocationsSearch });
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
      const result = await getDepartments({ 'page': 1, 'page_size': 25, search: debouncedDepartmentsSearch });
      setDepartments(result.data.data);
    } catch (error) {
      message.error('Failed to fetch departments.');
    }
  };


  useEffect(() => {
    fetchUserData();
  }, []);

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
        title={'Edit user'}
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
          <Form.Item<UserUpdateScheme>
            label={t('Email')}
            name="email"
          >
            <Input />
          </Form.Item>

          <Form.Item<UserUpdateScheme>
            label={t('First name')}
            name="first_name"
          >
            <Input />
          </Form.Item>

          <Form.Item<UserUpdateScheme>
            label={t('Last name')}
            name="last_name"
          >
            <Input />
          </Form.Item>

          <Form.Item<UserUpdateScheme>
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

          <Form.Item<UserUpdateScheme>
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

          <Form.Item<UserUpdateScheme>
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


          <Form.Item<UserUpdateScheme>
            label={t('Notes')}
            name="notes"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item<UserUpdateScheme>
            label={t('Active')}
            name="is_active"
            valuePropName="checked"
          >
            <Switch />
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

export default UserEditPage;
