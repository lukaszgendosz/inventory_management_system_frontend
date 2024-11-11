import React, { useEffect, useState } from 'react';
import { Button, Form, type FormProps, Input, Flex, Card, message, Row, Col, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import {ModelCreateScheme} from '../../models/model';
import useModelService from '../../services/api/models';
import useManufacturerService from '../../services/api/manufacturers';
import { ManufacturerResponseScheme } from '../../models/manufacturer';
import useDebounce from '../../hooks/useDebounce';
import { SortOrder } from '../../utils/constraints';

const { Option } = Select;

const t = (arg: string) => {
  return arg;
};

const ModelCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { createModel } = useModelService();
  const { getManufacturers } = useManufacturerService();
  const [manufacturers, setManufacturers] = useState<ManufacturerResponseScheme[]>([]);
  const [manufacturersSearch, setManufacturersSearch] = useState<string>('');
  const debouncedManufacturersSearch = useDebounce(manufacturersSearch, 500);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const onFinish: FormProps<ModelCreateScheme>["onFinish"] = async (values) => {
    try {
      await createModel(values);

      message.success('Model created successfully!');
      navigate(`/models`); 
    } catch (error) {
      message.error('Failed to create model.');
    }
  };
  const fetchManufacturers = async () => {
    try {
      const result = await getManufacturers({ 'page': 1, 'page_size': 500, search: debouncedManufacturersSearch, order_by: 'name', sort_order: SortOrder.ASC });
      setManufacturers(result.data.data);
      setIsFirstLoad(false);
    } catch (error) {
      message.error('Failed to fetch manufacturers.');
    }
  };

  useEffect(() => {
    if (!isFirstLoad) fetchManufacturers();
  }, [debouncedManufacturersSearch]);


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
        title={'Create model'}
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
          name="createModel"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<ModelCreateScheme>
            label={t('Name')}
            name="name"
            rules={[{ required: true, message: 'Enter model name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ModelCreateScheme>
            label={t('Model number')}
            name="model_number"
          >
            <Input />
          </Form.Item>
          
          <Form.Item<ModelCreateScheme>
            label={t('Manufacturer')}
            name="manufacturer_id"
          >
            <Select 
              showSearch={true} 
              onSearch={setManufacturersSearch}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  fetchManufacturers();
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
              {manufacturers.map((manufacturer) => (
                <Option key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </Option>
              ))}
            </Select>
          </Form.Item>


          <Form.Item<ModelCreateScheme>
            label={t('Notes')}
            name="notes"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Row justify="space-between">
              <Col><Button onClick={() => navigate('/models')}>{t('Cancel')}</Button></Col>
              <Col><Button type="primary" htmlType="submit" style={{ float: 'right' }}>{t('Submit')}</Button></Col>
          </Row>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default ModelCreatePage;
