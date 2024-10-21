import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';

interface NavbarProps {
    children?: React.ReactNode;
}

const navItems = [
  { name: "Me", path: "/mee" },
  { name: "Assets", path: "/assets" },
  { name: "Users", path: "/users" },
  { name: "Locations", path: "/locations" },
  { name: "Admin", path: "/admin" },
];

const Navbar: React.FC<NavbarProps> = ({ children }) => {
    const navigate = useNavigate();

    return (
        <>
            <Menu mode="horizontal" style={{ justifyContent: 'right' }}>
                {navItems.map(item => <Menu.Item key={item.path} onClick={() => navigate(item.path)}>{item.name}</Menu.Item>)}
                <Menu.SubMenu
                    title={
                            <UserOutlined />
                    }
                >
                    <Menu.Item key="logout" onClick={() => navigate('/logout')}>Logout</Menu.Item>
                </Menu.SubMenu>
            </Menu>
            {children}
        </>
    );
};

export default Navbar;

