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
            <Route path="/" element={<Home magazines={magazines} onUpdate={loadMagazines} />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/magazine/:id" element={<MagazineDetail />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route 
              path="/admin" 
              element={
                <AdminRoute 
                  element={<AdminPanel onAddMagazine={updateMagazines} />} 
                />
              } 
            />
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