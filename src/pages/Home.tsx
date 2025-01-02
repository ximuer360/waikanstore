import React, { useState } from 'react';
import { Row, Col, Card, Tag, Input, Pagination, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Magazine } from '../types/magazine';
import { api } from '../services/api';

const { Meta } = Card;
const { Search } = Input;

const PAGE_SIZE = 12; // 每页显示12个项目 (4列 x 3行)

const Home: React.FC<{ magazines: Magazine[], onUpdate: () => void }> = ({ magazines, onUpdate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');

  // 处理搜索
  const filteredMagazines = magazines.filter(magazine => 
    magazine.title.toLowerCase().includes(searchText.toLowerCase()) ||
    magazine.description.toLowerCase().includes(searchText.toLowerCase())
  );

  // 计算当前页的数据
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

  return (
    <div className="home-container">
      {/* 搜索栏 */}
      <Search
        placeholder="搜索杂志..."
        enterButton={<SearchOutlined />}
        size="large"
        onChange={e => setSearchText(e.target.value)}
      />

      {/* 杂志列表 */}
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
                /* description={magazine.description}*/
              />
              <div style={{ marginTop: 12 }}>
                <Tag color="blue">{magazine.category}</Tag>
                {magazine.isFreeTrial && <Tag color="green">免费下载</Tag>}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 分页 */}
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

export default Home; 