import React, { useEffect } from 'react';
import { Button, Form, type FormProps, Input, Flex, Card, Image } from 'antd';
import { UserLoginScheme } from '../models/user';
import { onLogin } from '../services/api/auth';
import { useNavigate } from 'react-router-dom';
import {useAuth } from '../hooks/useAuth';

const t = (arg: string) => {
  return arg
};

const Login: React.FC = () => {
    const navigate = useNavigate()
    const { setAuth } = useAuth();


    const onFinish: FormProps<UserLoginScheme>["onFinish"] = (values) => {
        try {
            onLogin!({email: values.email, password: values.password}).then(result => {
                const { access_token, refresh_token, role } = result.data;
                setAuth({access_token, role});
                localStorage.setItem('refresh_token', refresh_token);
                navigate('/users')
            });
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        if (localStorage.getItem('refresh_token')) {
            navigate('/me');
        }
    }, []);

    return (
        <Flex style={{
            width: '100vw',
            height: '100vh',
        }} justify="center" align="center">
            <Card title={'Sign In'}
                style={{
                    minWidth: 500,
                    maxWidth: '50%'
                }} bordered={true} >
                <Image
                    preview={false}
                    style={{
                        maxWidth: 800,
                        paddingBottom: '24px'
                    }}
                    src={'logo'}
                />
                <Form
                    name="signIn"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 800 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<UserLoginScheme>
                        label={t('Email')}
                        name="email"
                        rules={[{ required: true, message: t("common.input-error") }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<UserLoginScheme>
                        label={t('Password')}
                        name="password"
                        rules={[{ required: true, message: t("common.input-error") }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            {t('Sign in')}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Flex>
    )
};

export default Login;