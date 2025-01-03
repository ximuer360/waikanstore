import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { getMenuItems } from '../config/categories';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const location = useLocation();
  const menuItems = getMenuItems();

  return (
    <AntHeader style={{ position: 'fixed', zIndex: 1, width: '100%', background: '#fff' }}>
      <div className="logo" style={{ float: 'left', marginRight: '24px' }}>
        <Link to="/" style={{ color: '#1890ff', fontSize: '18px', fontWeight: 'bold' }}>
          外刊库
        </Link>
      </div>
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[location.pathname]}
      >
        {menuItems.map(item => (
          <Menu.Item key={item.key}>
            <Link to={item.key}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </AntHeader>
  );
};

export default Header; 