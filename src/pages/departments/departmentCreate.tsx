import React from 'react';
import { Button, Form, type FormProps, Input, Flex, Card, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import {DepartmentCreateScheme} from '../../models/department';
import useDepartmentService from '../../services/api/departments';


const t = (arg: string) => {
  return arg;
};

const DepartmentCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { createDepartment } = useDepartmentService();



 

  const onFinish: FormProps<DepartmentCreateScheme>["onFinish"] = async (values) => {
    try {
      await createDepartment(values);

      message.success('Department created successfully!');
      navigate(`/departments`); 
    } catch (error) {
      message.error('Failed to create department.');
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
        title={'Create department'}
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
          name="createDepartment"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<DepartmentCreateScheme>
            label={t('Name')}
            name="name"
            rules={[{ required: true, message: 'Enter department name!' }]}
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

export default DepartmentCreatePage;
