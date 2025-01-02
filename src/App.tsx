import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/Header';
import Home from './pages/Home';
import MagazineDetail from './pages/MagazineDetail';
import AdminPanel from './pages/admin/AdminPanel';
import { Magazine } from './types/magazine';
import { api } from './services/api';
import './styles/global.css';
import CategoryPage from './pages/CategoryPage';

const { Content, Footer } = Layout;

function App() {
  const [magazines, setMagazines] = React.useState<Magazine[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadMagazines = async () => {
    try {
      setLoading(true);
      console.log('Loading magazines...');
      const data = await api.getAllMagazines();
      console.log('Loaded magazines:', data);
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

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>加载中...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  if (!magazines || magazines.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>暂无数据</div>;
  }

  const updateMagazines = async (formData: FormData) => {
    const newMagazine = await api.addMagazine(formData);
    setMagazines([...magazines, newMagazine]);
  };

  return (
    <Router>
      <Layout className="layout">
        <Header />
        <Content style={{ padding: '0', marginTop: 64 }}>
          <Routes>
            <Route path="/" element={<Home magazines={magazines} onUpdate={loadMagazines} />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/magazine/:id" element={<MagazineDetail />} />
            <Route path="/admin" element={<AdminPanel onAddMagazine={updateMagazines} />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          外刊库 ©{new Date().getFullYear()} Created by Your Name
        </Footer>
      </Layout>
    </Router>
  );
}

export default App; 