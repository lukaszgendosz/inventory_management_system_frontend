import { EnvironmentOutlined, GoldOutlined, LaptopOutlined, TeamOutlined, TruckOutlined } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import { AiOutlineProduct } from "react-icons/ai";
import { BsBuilding } from "react-icons/bs";
import { MdOutlineFactory } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface LayoutSiderProps {
    collapsed: boolean
  }

const LayoutSider: React.FC<LayoutSiderProps> = ( { collapsed }) => {
    const navigate = useNavigate();
    const navItems = [
        { name: 'Assets', path: '/assets', icon: <LaptopOutlined style={{ fontSize: '1.2rem' }} /> },
        { name: 'Users', path: '/users', icon: <TeamOutlined style={{ fontSize: '1.2rem' }} /> },
        { name: 'Locations', path: '/locations', icon: <EnvironmentOutlined style={{ fontSize: '1.2rem' }} /> },
        { name: 'Departments', path: '/departments', icon: <GoldOutlined style={{ fontSize: '1.2rem' }} /> },
        { name: 'Companies', path: '/companies', icon: <BsBuilding style={{ fontSize: '1.2rem' }} /> },
        { name: 'Models', path: '/models', icon: <AiOutlineProduct style={{ fontSize: '1.2rem' }} /> },
        { name: 'Suppliers', path: '/suppliers', icon: <TruckOutlined style={{ fontSize: '1.2rem' }} /> },
        { name: 'Manufacturers', path: '/manufacturers', icon: <MdOutlineFactory style={{ fontSize: '1.2rem' }} /> }
    
      ];

      const siderMenu: MenuProps['items'] = navItems.map((item) => ({
        key: item.name.toLowerCase(),
        label: item.name,
        icon: item.icon,
        onClick: () => navigate(item.path),
      }));


    return (
        <Sider width={200} trigger={null} collapsible collapsed={collapsed} >
          <div
            className="demo-logo-vertical"
            style={{ height: 36, margin: 14, backgroundColor: 'rgba(255, 255, 255, 0.3)', cursor: 'pointer' }}
            onClick={() => navigate('/me')}
          />
            <Menu
                theme='dark'
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{  borderRight: 0 }}
                items={siderMenu}
            />
        </Sider>
    )
}

export default LayoutSider