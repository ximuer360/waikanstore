import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/Header';
import Home from './pages/Home';
import MagazineDetail from './pages/MagazineDetail';
import AdminPanel from './pages/admin/AdminPanel';
import CategoryPage from './pages/CategoryPage';
import AdminRoute from './components/AdminRoute';
import { Magazine } from './types/magazine';
import { api } from './services/api';
import './styles/global.css';
import LoginPage from './pages/admin/LoginPage';
import { clearVipStatus } from './utils/vip';

const { Content, Footer } = Layout;

function App() {
  const [magazines, setMagazines] = React.useState<Magazine[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadMagazines = async () => {
    try {
      setLoading(true);
      const data = await api.getAllMagazines();
      setMagazines(data);
      setError(null);
    } catch (err) {
      console.error('Error loading magazines:', err);
      setError('加载杂志数据失败');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadMagazines();
  }, []);

  const updateMagazines = async (formData: FormData): Promise<Magazine> => {
    const newMagazine = await api.addMagazine(formData);
    setMagazines(prev => [...prev, newMagazine]);
    return newMagazine;
  };

  // 定期检查 VIP 状态
  React.useEffect(() => {
    const checkVipStatus = () => {
      const expireTime = localStorage.getItem('vipKeyExpireTime');
      if (expireTime && Date.now() > parseInt(expireTime)) {
        clearVipStatus();
      }
    };

    // 每小时检查一次
    const interval = setInterval(checkVipStatus, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>加载中...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  return (
    <Router>
      <Layout className="layout">
        <Header />
        <Content style={{ padding: '0', marginTop: 64 }}>
          <Routes>
            <Route path="/admin/login" element={<LoginPage />} />
            <Route 
              path="/admin" 
              element={
                <AdminRoute 
                  element={<AdminPanel onAddMagazine={updateMagazines} />} 
                />
              } 
            />
            <Route path="/" element={<Home magazines={magazines} onUpdate={loadMagazines} />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/magazine/:id" element={<MagazineDetail />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          外刊库 ©{new Date().getFullYear()} Created by 西木训练营
        </Footer>
      </Layout>
    </Router>
  );
}

export default App; 