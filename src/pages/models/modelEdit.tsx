import React, { useEffect, useState } from 'react';
import { Button, Form, type FormProps, Input, Flex, Card, message, Row, Col, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ModelUpdateScheme } from '../../models/model';
import { ManufacturerResponseScheme } from '../../models/manufacturer';
import useManufacturerService from '../../services/api/manufacturers';
import useDebounce from '../../hooks/useDebounce';

import useModelService from '../../services/api/models';
import { SortOrder } from '../../utils/constraints';

const { Option } = Select;

const t = (arg: string) => {
  return arg;
};

const ModelEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();
  const { getModel, updateModel } = useModelService();
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const { getManufacturers } = useManufacturerService();
  const [manufacturers, setManufacturers] = useState<ManufacturerResponseScheme[]>([]);
  const [manufacturersSearch, setManufacturersSearch] = useState<string>('');
  const debouncedManufacturersSearch = useDebounce(manufacturersSearch, 500);
  

  const onFinish: FormProps<ModelUpdateScheme>["onFinish"] = async (values) => {
    try {

      await updateModel(Number(id), values);

      message.success('Model updated successfully!');
      navigate('/models'); 
    } catch (error) {
      message.error('Failed to update model.');
    }
  };

  const fetchModelData = async () => {
    try {
      const response = await getModel(Number(id));
      const modelData = response.data;

      
      form.setFieldsValue({
        name: modelData.name,
      });
      setIsFirstLoad(false);
    } catch (error) {
      message.error('Failed to fetch model data.');
    }
  };
  const fetchManufacturers = async () => {
    try {
      const result = await getManufacturers({ 'page': 1, 'page_size': 500, search: debouncedManufacturersSearch, order_by: 'name', sort_order: SortOrder.ASC });
      setManufacturers(result.data.data);
    } catch (error) {
      message.error('Failed to fetch manufacturers.');
    }
  };



  useEffect(() => {
    fetchModelData();
  }, []);

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
        title={'Edit model'}
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
          name="editModel"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >

          <Form.Item<ModelUpdateScheme>
            label={t('Name')}
            name="name"
          >
            <Input />
          </Form.Item>

          <Form.Item<ModelUpdateScheme>
            label={t('Model number')}
            name="model_number"
          >
            <Input />
          </Form.Item>
          
          <Form.Item<ModelUpdateScheme>
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

          <Form.Item<ModelUpdateScheme>
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

export default ModelEditPage;
