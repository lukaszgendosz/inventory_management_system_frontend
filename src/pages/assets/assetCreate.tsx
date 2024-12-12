import React, { useEffect, useState } from 'react';
import { Button, Form, type FormProps, Input, Flex, Card, Select, message, Row, Col, DatePicker, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AssetCreateScheme, Status } from '../../models/asset';
import useAssetService from '../../services/api/assets';
import useLocationService from '../../services/api/locations';
import useCompanyService from '../../services/api/companies';
import { LocationResponseScheme } from '../../models/location';
import { CompanyResponseScheme } from '../../models/company';
import useDebounce from '../../hooks/useDebounce';
import { SortOrder } from '../../utils/constraints';
import { ModelResponseScheme } from '../../models/model';
import { SupplierResponseScheme } from '../../models/supplier';
import useModelService from '../../services/api/models';
import useSupplierService from '../../services/api/suppliers';

const { Option } = Select;

const t = (arg: string) => {
  return arg;
};

const AssetCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { createAsset } = useAssetService();
  const { getLocations } = useLocationService();
  const { getCompanies } = useCompanyService();
  const { getModels } = useModelService();
  const { getSuppliers } = useSupplierService();

  const [locations, setLocations] = useState<LocationResponseScheme[]>([]);
  const [companies, setCompanies] = useState<CompanyResponseScheme[]>([]);
  const [models, setModels] = useState<ModelResponseScheme[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierResponseScheme[]>([]);
  const [locationsSearch, setLocationsSearch] = useState<string>('');
  const [companiesSearch, setCompaniesSearch] = useState<string>('');
  const [modelsSearch, setModelsSearch] = useState<string>('');
  const [suppliersSearch, setSuppliersSearch] = useState<string>('');
  const debouncedLocationsSearch = useDebounce(locationsSearch, 250);
  const debouncedCompaniesSearch = useDebounce(companiesSearch, 250);
  const debouncedModelsSearch = useDebounce(modelsSearch, 250);
  const debouncedSuppliersSearch = useDebounce(suppliersSearch, 250);

  const onFinish: FormProps<AssetCreateScheme>["onFinish"] = async (values) => {
    try {
      const asset = await createAsset(values);
      message.success('Asset created successfully!');
      navigate(`/assets/${asset.data.id}`);
    } catch (error) {
      message.error('Failed to create asset.');
    }
  };

  const fetchLocations = async () => {
    try {
      const result = await getLocations({ 
        'page': 1, 
        'page_size': 25, 
        search: debouncedLocationsSearch, 
        order_by: 'name', 
        sort_order: SortOrder.ASC 
      });
      setLocations(result.data.data);
    } catch (error) {
      message.error('Failed to fetch locations.');
    }
  };

  const fetchCompanies = async () => {
    try {
      const result = await getCompanies({ 
        'page': 1, 
        'page_size': 25, 
        search: debouncedCompaniesSearch, 
        order_by: 'name', 
        sort_order: SortOrder.ASC 
      });
      setCompanies(result.data.data);
    } catch (error) {
      message.error('Failed to fetch companies.');
    }
  };

  const fetchModels = async () => {
    try {
      const result = await getModels({ 
        'page': 1, 
        'page_size': 25, 
        search: debouncedModelsSearch, 
        order_by: 'name', 
        sort_order: SortOrder.ASC,
        manufacturer_id: null
      });
      setModels(result.data.data);
    } catch (error) {
      message.error('Failed to fetch models.');
    }
  };

  const fetchSuppliers = async () => {
    try {
      const result = await getSuppliers({ 
        'page': 1, 
        'page_size': 25, 
        search: debouncedSuppliersSearch, 
        order_by: 'name', 
        sort_order: SortOrder.ASC 
      });
      setSuppliers(result.data.data);
    } catch (error) {
      message.error('Failed to fetch suppliers.');
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [debouncedLocationsSearch]);

  useEffect(() => {
    fetchCompanies();
  }, [debouncedCompaniesSearch]);

  useEffect(() => {
    fetchModels();
  }, [debouncedModelsSearch]);

  useEffect(() => {
    fetchSuppliers();
  }, [debouncedSuppliersSearch]);

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
        title={'Create asset'}
        style={{
          width: 'calc(100%)',
          height: '100vh',
        }}
        bordered={true}
      >
        <Form
          style={{
            width: '40vw',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          name="createAsset"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<AssetCreateScheme>
            label={t('Name')}
            name="name"
            rules={[{ required: true, message: 'Please input asset name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<AssetCreateScheme>
            label={t('Serial number')}
            name="serial_number"
            rules={[{ required: true, message: 'Please input serial number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<AssetCreateScheme>
            label={t('Status')}
            name="status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select
              options={Object.entries(Status)
                .filter(([key]) => key !== 'Deployed')
                .map(([key, value]) => ({ 
                  label: t(`${key}`), 
                  value 
                }))}
            />
          </Form.Item>
          
          <Form.Item<AssetCreateScheme>
            label={t('Invoice number')}
            name="invoice_number"
          >
            <Input />
          </Form.Item>
          
          <Form.Item<AssetCreateScheme>
            label={t('Warranty expiration date')}
            name="varrianty_expiration_date"
          >
            <DatePicker />
          </Form.Item>

          <Form.Item<AssetCreateScheme>
            label={t('Purchase date')}
            name="purchase_date"
          >
            <DatePicker />
          </Form.Item>

          <Form.Item<AssetCreateScheme>
            label={t('Purchase cost')}
            name="purchase_cost"
          >
            <InputNumber />
          </Form.Item>

          <Form.Item<AssetCreateScheme>
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
              <Option key="none" value={null}>
                None
              </Option>
              {locations.map((location) => (
                <Option key={location.id} value={location.id}>
                  {location.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item<AssetCreateScheme>
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
              <Option key="none" value={null}>
                None
              </Option>
              {companies.map((company) => (
                <Option key={company.id} value={company.id}>
                  {company.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item<AssetCreateScheme>
            label={t('Model')}
            name="model_id"
          >
            <Select 
              showSearch={true} 
              onSearch={setModelsSearch}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  fetchModels();
                }
              }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              <Option key="none" value={null}>
                None
              </Option>
              {models.map((model) => (
                <Option key={model.id} value={model.id}>
                  {model.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item<AssetCreateScheme>
            label={t('Supplier')}
            name="supplier_id"
          >
            <Select 
              showSearch={true} 
              onSearch={setSuppliersSearch}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  fetchSuppliers();
                }
              }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              <Option key="none" value={null}>
                None
              </Option>
              {suppliers.map((supplier) => (
                <Option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item<AssetCreateScheme>
            label={t('Notes')}
            name="notes"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Row justify="space-between">
              <Col><Button onClick={() => navigate('/assets')}>{t('Cancel')}</Button></Col>
              <Col><Button type="primary" htmlType="submit" style={{ float: 'right' }}>{t('Submit')}</Button></Col>
            </Row>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default AssetCreatePage;
