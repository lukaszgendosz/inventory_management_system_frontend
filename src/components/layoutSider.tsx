import { DashboardOutlined, EnvironmentOutlined, GoldOutlined, LaptopOutlined, TeamOutlined, TruckOutlined } from "@ant-design/icons";
import { Menu, MenuProps, Image } from "antd";
import Sider from "antd/es/layout/Sider";
import { AiOutlineProduct } from "react-icons/ai";
import { BsBuilding } from "react-icons/bs";
import { MdOutlineFactory } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Role } from "../models/user";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

interface LayoutSiderProps {
    collapsed: boolean
  }

const LayoutSider: React.FC<LayoutSiderProps> = ( { collapsed }) => {
    const { auth } = useAuth(); 
    const [selectedKey, setSelectedKey] = useState<string>('dashboard');
    const navigate = useNavigate();
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <DashboardOutlined style={{ fontSize: '1.2rem' }} />, roles: [ Role.Manager, Role.Admin] },
        { name: 'Assets', path: '/assets', icon: <LaptopOutlined style={{ fontSize: '1.2rem' }} />, roles: [ Role.Manager, Role.Admin] },
        { name: 'Users', path: '/users', icon: <TeamOutlined style={{ fontSize: '1.2rem' }} />, roles: [Role.Manager, Role.Admin] },
        { name: 'Locations', path: '/locations', icon: <EnvironmentOutlined style={{ fontSize: '1.2rem' }} />, roles: [Role.Manager, Role.Admin] },
        { name: 'Departments', path: '/departments', icon: <GoldOutlined style={{ fontSize: '1.2rem' }} />, roles: [Role.Manager, Role.Admin] },
        { name: 'Companies', path: '/companies', icon: <BsBuilding style={{ fontSize: '1.2rem' }} />, roles: [Role.Manager, Role.Admin] },
        { name: 'Models', path: '/models', icon: <AiOutlineProduct style={{ fontSize: '1.2rem' }} />, roles: [Role.Manager, Role.Admin] },
        { name: 'Suppliers', path: '/suppliers', icon: <TruckOutlined style={{ fontSize: '1.2rem' }} />, roles: [Role.Manager, Role.Admin] },
        { name: 'Manufacturers', path: '/manufacturers', icon: <MdOutlineFactory style={{ fontSize: '1.2rem' }} />, roles: [Role.Manager, Role.Admin] }
    
      ];
      const filteredNavItems = navItems.filter((item) =>
        item.roles.includes(auth.current_user?.role as Role)
      );
    

      const siderMenu: MenuProps['items'] = filteredNavItems.map((item) => ({
        key: item.name.toLowerCase(),
        label: item.name,
        icon: item.icon,
        onClick: () => navigate(item.path),
      }));


    return (
        <Sider width={200} trigger={null} collapsible collapsed={collapsed} >
          <Image
            style={{ height: 36, width: 172, margin: 14, cursor: 'pointer' }}
            preview={false}
            src={`logo-pwr.webp`}
            onClick={() => {
              setSelectedKey('');
              navigate('/me')
            }}
          />
            <Menu
                theme='dark'
                mode="inline"
                onSelect={(key) => setSelectedKey(key.key)}
                defaultSelectedKeys={[selectedKey]}
                selectedKeys={[selectedKey]}
                style={{  borderRight: 0 }}
                items={siderMenu}
            />
        </Sider>
    )
}

export default LayoutSider