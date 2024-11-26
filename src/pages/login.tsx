import React, { useEffect } from 'react';
import { Button, Form, type FormProps, Input, Flex, Card, Image } from 'antd';
import { UserLoginScheme } from '../models/user';
import { onLogin } from '../services/api/auth';
import { useNavigate } from 'react-router-dom';
import {useAuth } from '../hooks/useAuth';
import useUserService from '../services/api/users';
import { useTheme } from '../hooks/useTheme';

const t = (arg: string) => {
  return arg
};

const Login: React.FC = () => {
    const navigate = useNavigate()
    const {getCurrentUser} = useUserService();
    const { setAuth } = useAuth();
    const { themeMode } = useTheme();


    const onFinish: FormProps<UserLoginScheme>["onFinish"] = (values) => {
        try {
            onLogin!({email: values.email, password: values.password}).then(result => {
                const { access_token, refresh_token } = result.data;
                setAuth({access_token: access_token});
                localStorage.setItem('refresh_token', refresh_token);
                getCurrentUser(access_token).then(res => {
                    const current_user = res.data
                    setAuth({current_user: current_user});
                });
                navigate('/me');
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
            backgroundColor: themeMode === 'dark' ? '#141414' : '#ffffff',
            backgroundSize: 'cover',

        }} justify="center" align="center">
            <Card title={'Sign In'}
                style={{
                    minWidth: '25%',
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
                        rules={[{ required: true, message: t("Enter your email.") }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<UserLoginScheme>
                        label={t('Password')}
                        name="password"
                        rules={[{ required: true, message: t("Enter your password.") }]}
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