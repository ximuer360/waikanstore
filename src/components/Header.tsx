import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { key: '/', label: '首页', path: '/' },
    { key: '/category/newspapers', label: '期刊报纸', path: '/category/newspapers' },
    { key: '/category/magazines', label: '人文地理', path: '/category/magazines' },
    { key: '/category/business', label: '商业财经', path: '/category/business' },
    { key: '/category/entertainment', label: '娱乐时尚', path: '/category/entertainment' },
    { key: '/category/ebooks', label: '电子书资源', path: '/category/ebooks' },
    { key: '/admin', label: '管理后台', path: '/admin' }
  ];

  return (
    <AntHeader style={{ position: 'fixed', zIndex: 1, width: '100%', background: '#fff' }}>
      <div style={{ float: 'left', marginRight: 50 }}>
        <Link to="/" style={{ color: '#000', fontSize: '18px' }}>
          外刊库
        </Link>
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems.map(item => ({
          key: item.path,
          label: <Link to={item.path}>{item.label}</Link>
        }))}
      />
    </AntHeader>
  );
};

export default Header; 