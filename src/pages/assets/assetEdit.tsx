import React, { useEffect, useState } from 'react';
import { Button, Form, type FormProps, Input, Flex, Card, Select, message, Row, Col, DatePicker, InputNumber } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { AssetResponseScheme, AssetUpdateScheme, Status } from '../../models/asset';
import useAssetService from '../../services/api/assets';
import useLocationService from '../../services/api/locations';
import useCompanyService from '../../services/api/companies';
import useDepartmentService from '../../services/api/departments';
import { LocationResponseScheme } from '../../models/location';
import { DepartmentResponseScheme } from '../../models/department';
import { CompanyResponseScheme } from '../../models/company';
import useDebounce from '../../hooks/useDebounce';
import { SortOrder } from '../../utils/constraints';
import dayjs from 'dayjs';
import { ModelResponseScheme } from '../../models/model';
import { SupplierResponseScheme } from '../../models/supplier';
import useModelService from '../../services/api/models';
import useSupplierService from '../../services/api/suppliers';

const { Option } = Select;

const t = (arg: string) => {
  return arg;
};

const AssetEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();
  const { getAsset, updateAsset } = useAssetService();
  const { getLocations } = useLocationService();
  const { getCompanies } = useCompanyService();
  const { getDepartments } = useDepartmentService();
  const { getModels } = useModelService();
  const { getSuppliers } = useSupplierService();

  const [asset, setAsset] = useState<AssetResponseScheme>();
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [locations, setLocations] = useState<LocationResponseScheme[]>([]);
  const [companies, setCompanies] = useState<CompanyResponseScheme[]>([]);;
  const [departmentsSearch, setDepartmentsSearch] = useState<string>('');
  const [companiesSearch, setCompaniesSearch] = useState<string>('');
  const [locationsSearch, setLocationsSearch] = useState<string>('');
  const [models, setModels] = useState<ModelResponseScheme[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierResponseScheme[]>([]);
  const [modelsSearch, setModelsSearch] = useState<string>('');
  const [suppliersSearch, setSuppliersSearch] = useState<string>('');
  const debouncedDepartmentsSearch = useDebounce(departmentsSearch, 250);
  const debouncedCompaniesSearch = useDebounce(companiesSearch, 250);
  const debouncedLocationsSearch = useDebounce(locationsSearch, 250);
  const debouncedModelsSearch = useDebounce(modelsSearch, 250);
  const debouncedSuppliersSearch = useDebounce(suppliersSearch, 250);

  const onFinish: FormProps<AssetUpdateScheme>["onFinish"] = async (values) => {
    try {
      const asset = await updateAsset(Number(id), values);
      navigate(`/assets/${asset.data.id}`); 
    } catch (error) {
      message.error('Failed to update asset.');
    } finally {
      message.success('Asset updated successfully!');
    }
  };

  const fetchAssetData = async () => {
    try {
      const response = await getAsset(Number(id));
      const assetData = response.data;
      setAsset(assetData);

      console.log(assetData.varrianty_expiration_date);
      form.setFieldsValue({
        name: assetData.name,
        serial_number: assetData.serial_number,
        status: assetData.status,
        checkout_type: assetData.checkout_type,
        purchase_date: assetData.purchase_date ? dayjs(assetData.purchase_date) : null,
        purchase_cost: assetData.purchase_cost,
        invoice_number: assetData.invoice_number,
        varrianty_expiration_date: assetData.varrianty_expiration_date ? dayjs(assetData.varrianty_expiration_date) : null,
        model_id: assetData.model?.id ?? null,
        supplier_id: assetData.supplier?.id ?? null,
        user_id: assetData.user?.id ?? null,
        location_id: assetData.location?.id ?? null,
        company_id: assetData.company?.id ?? null,
        notes: assetData.notes,
      });

      if (assetData.location?.id && assetData.location?.name) {
        setLocations([assetData.location]);
      }

      if (assetData.company?.id && assetData.company?.name) {
        setCompanies([assetData.company]);
      }

      if (assetData.model?.id && assetData.model?.name) {
        setModels([assetData.model]);
      }

      if (assetData.supplier?.id && assetData.supplier?.name) {
        setSuppliers([assetData.supplier]);
      }

      setIsFirstLoad(false);
    } catch (error) {
      message.error('Failed to fetch asset data.');
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
    fetchAssetData();
  }, []);

  useEffect(() => {
    if (!isFirstLoad) fetchLocations();
  }, [debouncedLocationsSearch]);

  useEffect(() => {
    if (!isFirstLoad) fetchCompanies();
  }, [debouncedCompaniesSearch]);


  useEffect(() => {
    if (!isFirstLoad) fetchModels();
  }, [debouncedModelsSearch]);

  useEffect(() => {
    if (!isFirstLoad) fetchSuppliers();
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
        title={'Edit asset'}
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
          name="editAsset"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<AssetUpdateScheme>
            label={t('Name')}
            name="name"
          >
            <Input />
          </Form.Item>

          <Form.Item<AssetUpdateScheme>
            label={t('Serial number')}
            name="serial_number"
          >
            <Input />
          </Form.Item>

          <Form.Item<AssetUpdateScheme>
            label={t('Status')}
            name="status"
          >
            <Select
              disabled={asset?.status === Status.Deployed}
              options={Object.entries(Status).map(([key, value]) => ({ label: t(`${key}`), value }))}>
            </Select>
          </Form.Item>
          
          <Form.Item<AssetUpdateScheme>
            label={t('Invoice number')}
            name="invoice_number"
            getValueProps={(value) => ({ value: value ? value : "", })}
          >
            <Input />
          </Form.Item>
          
          <Form.Item<AssetUpdateScheme>
            label={t('Warranty expiration date')}
            name="varrianty_expiration_date"
          >
              <DatePicker />
          </Form.Item>

          <Form.Item<AssetUpdateScheme>
            label={t('Purchase date')}
            name="purchase_date"
          >
            <DatePicker />
          </Form.Item>

          <Form.Item<AssetUpdateScheme>
            label={t('Purchase cost')}
            name="purchase_cost"
          >
            <InputNumber  />
          </Form.Item>

          <Form.Item<AssetUpdateScheme>
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

          <Form.Item<AssetUpdateScheme>
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

          <Form.Item<AssetUpdateScheme>
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

          <Form.Item<AssetUpdateScheme>
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

          <Form.Item<AssetUpdateScheme>
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

export default AssetEditPage;
