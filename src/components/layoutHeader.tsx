import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, SunOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar, Button, Col, Dropdown, Menu, MenuProps, Row, Switch } from "antd"
import { Header } from "antd/es/layout/layout"
import { useTheme } from "../hooks/useTheme"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"

interface LayoutHeaderProps {
    collapsed: boolean
    setCollapsed: (value: boolean) => void;
  }
const LayoutHeader: React.FC<LayoutHeaderProps> = ( { collapsed, setCollapsed }) => {
    const { themeMode, toggleTheme } = useTheme()
    const { setAuth } = useAuth()
    const navigate = useNavigate()
    const handleUserMenuClick = ({ key }: { key: string }) => {
        if (key === 'logout') {
          setAuth({});
          localStorage.removeItem('refresh_token');
          navigate('/login');
        } else if (key === 'profile') {
          navigate('/me');
        }
      };
    const userMenu: MenuProps = {
        onClick: handleUserMenuClick,
        items: [
            {
                key: 'profile',
                icon: <UserOutlined />,
                label: 'Profile',
            },
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Logout',
            },
        ],
    };

    return (
        <Header style={{ padding: 0 }}>
            <Menu>
                <Row align="middle" style={{ width: '100%', height: 64, padding: '0 24px' }}>
                    <Col flex="none"><Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} /></Col>
                    
                    <Col flex="auto" />
                    
                    <Col style={{ marginRight: 16 }}>
                    <Switch  
                    checkedChildren={<MoonOutlined />} 
                    unCheckedChildren={<SunOutlined />} 
                    checked={themeMode === 'dark'} 
                    onChange={toggleTheme} 
                    />
                    </Col>
                    
                    <Col><Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
                        <Avatar
                            style={{ cursor: 'pointer' }}
                            icon={<UserOutlined />}/>
                        </Dropdown>
                    </Col>
                </Row>
            </Menu>
        </Header>
    )
}

export default LayoutHeader