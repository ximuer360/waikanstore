import React from 'react';
import { useParams } from 'react-router-dom';

const MagazineDetail: React.FC = () => {
  const { id } = useParams();
  
  return (
    <div>
      <h1>杂志详情页 {id}</h1>
    </div>
  );
};

export default MagazineDetail; 