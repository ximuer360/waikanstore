import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Tag, Input, Pagination, message, Image } from 'antd';
import { SearchOutlined, DownloadOutlined, CrownOutlined } from '@ant-design/icons';
import { Magazine } from '../types/magazine';
import { api } from '../services/api';
import VipQRCodeModal from '../components/VipQRCodeModal';
import { getCategoryLabel } from '../config/categories';

const { Meta } = Card;
const { Search } = Input;

const PAGE_SIZE = 12;

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [vipModalVisible, setVipModalVisible] = useState(false);

  useEffect(() => {
    loadMagazines();
  }, [category]);

  const loadMagazines = async () => {
    try {
      setLoading(true);
      const data = await api.getAllMagazines();
      // 根据分类筛选杂志
      const filteredData = data.filter(magazine => magazine.category === category);
      setMagazines(filteredData);
    } catch (error) {
      console.error('Error loading magazines:', error);
      message.error('加载杂志失败');
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (!img.src.includes('placeholder.jpg')) {
      img.src = 'http://localhost:5001/images/placeholder.jpg';
    }
  };

  const getImageUrl = (coverUrl: string) => {
    return `http://localhost:5001${coverUrl}`;
  };

  const handleDownload = (url: string | undefined) => {
    if (!url) {
      message.error('下载链接不可用');
      return;
    }
    navigator.clipboard.writeText(url);
    message.success('下载链接已复制到剪贴板');
  };

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

  return (
    <div className="home-container">
      <h1 className="category-title">
        {getCategoryLabel(category || '')}
      </h1>
      
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
                  <Image
                    alt={magazine.title}
                    src={getImageUrl(magazine.coverUrl)}
                    onError={handleImageError}
                    className="magazine-cover-image"
                    preview={{
                      mask: '点击查看大图'
                    }}
                  />
                </div>
              }
            >
              <Meta title={magazine.title} />
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: '8px', color: '#999' }}>
                <span style={{ fontSize: '12px' }}>
                  {new Date(magazine.publishDate).toLocaleDateString()}
                </span>
                <span>/</span>
                {magazine.isVip ? (
                  <Tag 
                    color="gold" 
                    icon={<CrownOutlined />}
                    onClick={() => setVipModalVisible(true)}
                    style={{ cursor: 'pointer', margin: 0 }}
                  >
                    VIP
                  </Tag>
                ) : magazine.isFreeTrial && magazine.downloadUrl ? (
                  <Tag 
                    color="green" 
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload(magazine.downloadUrl)}
                    style={{ cursor: 'pointer', margin: 0 }}
                  >
                    免费下载
                  </Tag>
                ) : null}
                <span>/</span>
                <Tag color="blue" style={{ margin: 0 }}>{getCategoryLabel(magazine.category)}</Tag>
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

      <VipQRCodeModal 
        visible={vipModalVisible}
        onClose={() => setVipModalVisible(false)}
      />
    </div>
  );
};

export default CategoryPage; 