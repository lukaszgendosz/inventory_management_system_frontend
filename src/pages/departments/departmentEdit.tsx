import React, { useEffect } from 'react';
import { Button, Form, type FormProps, Input, Flex, Card, message, Row, Col } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { DepartmentUpdateScheme } from '../../models/department';

import useDepartmentService from '../../services/api/departments';


const t = (arg: string) => {
  return arg;
};

const DepartmentEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();
  const { getDepartment, updateDepartment } = useDepartmentService();


  const onFinish: FormProps<DepartmentUpdateScheme>["onFinish"] = async (values) => {
    try {

      await updateDepartment(Number(id), values);

      message.success('Department updated successfully!');
      navigate('/departments'); 
    } catch (error) {
      message.error('Failed to update department.');
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await getDepartment(Number(id));
      const departmentData = response.data;

      
      form.setFieldsValue({
        name: departmentData.name,
      });

    } catch (error) {
      message.error('Failed to fetch department data.');
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
        title={'Edit department'}
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
          name="editDepartment"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >

          <Form.Item<DepartmentUpdateScheme>
            label={t('Name')}
            name="name"
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Row justify="space-between">
              <Col><Button onClick={() => navigate('/departments')}>{t('Cancel')}</Button></Col>
              <Col><Button type="primary" htmlType="submit" style={{ float: 'right' }}>{t('Submit')}</Button></Col>
            </Row>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default DepartmentEditPage;
