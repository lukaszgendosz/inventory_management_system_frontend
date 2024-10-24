import React, { useState } from 'react';
import { Layout, theme } from 'antd';

import LayoutHeader from './layoutHeader';
import LayoutSider from './layoutSider';

const { Content} = Layout;
interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
    
  const {
    token: { colorBgContainer, borderRadiusLG },} = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout style={{ minHeight: '100vh', maxHeight: '100vh' }}>

      <LayoutSider collapsed={collapsed} />
      <Layout style={{ flex: 1, display: 'flex' }}>

      <LayoutHeader collapsed={collapsed} setCollapsed={setCollapsed} />

        <Layout
          style={{
            padding: '25px 25px 25px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Content
            style={{
              padding: 0,
              margin: 0,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              overflow: 'auto',
              flex: 1,
              flexDirection: 'column'
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Navbar;
