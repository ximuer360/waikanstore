import React from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Tag, Input, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Magazine } from '../types/magazine';
import { api } from '../services/api';

const { Meta } = Card;
const { Search } = Input;

const PAGE_SIZE = 12;

interface CategoryParams {
  category?: string;
  [key: string]: string | undefined;
}

const CategoryPage: React.FC = () => {
  const { category } = useParams<CategoryParams>();
  const [magazines, setMagazines] = React.useState<Magazine[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchText, setSearchText] = React.useState('');

  React.useEffect(() => {
    const loadMagazines = async () => {
      try {
        setLoading(true);
        const allMagazines = await api.getAllMagazines();
        const filteredMagazines = allMagazines.filter(
          (magazine: Magazine) => magazine.category === category
        );
        setMagazines(filteredMagazines);
      } catch (error) {
        console.error('Error loading magazines:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMagazines();
  }, [category]);

  const filteredMagazines = magazines.filter((magazine: Magazine) =>
    magazine.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const currentMagazines = filteredMagazines.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (!img.src.includes('placeholder.jpg')) {
      img.src = 'http://localhost:5001/images/placeholder.jpg';
    }
  };

  const getImageUrl = (coverUrl: string) => {
    return `http://localhost:5001${coverUrl}`;
  };

  const getCategoryName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      newspapers: '期刊报纸',
      magazines: '人文地理',
      business: '商业财经',
      entertainment: '娱乐时尚',
      ebooks: '电子书资源'
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="home-container">
      <h1 className="category-title">{getCategoryName(category || '')}</h1>
      
      <Search
        placeholder="搜索杂志..."
        enterButton={<SearchOutlined />}
        size="large"
        onChange={e => setSearchText(e.target.value)}
      />

      <Row gutter={[24, 32]} className="magazines-grid">
        {currentMagazines.map((magazine) => (
          <Col xs={24} sm={12} md={8} lg={6} key={magazine.id}>
            <Card
              hoverable
              className="magazine-card"
              cover={
                <div className="magazine-cover-container">
                  <img 
                    alt={magazine.title} 
                    src={getImageUrl(magazine.coverUrl)}
                    onError={handleImageError}
                    className="magazine-cover-image"
                  />
                </div>
              }
            >
              <Meta
                title={magazine.title}
              />
              <div style={{ marginTop: 12 }}>
                <Tag color="blue">{getCategoryName(magazine.category)}</Tag>
                {magazine.isFreeTrial && <Tag color="green">免费下载</Tag>}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredMagazines.length > PAGE_SIZE && (
        <div className="pagination-container">
          <Pagination
            current={currentPage}
            total={filteredMagazines.length}
            pageSize={PAGE_SIZE}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showQuickJumper
          />
        </div>
      )}
    </div>
  );
};

export default CategoryPage; 