import wsj_cover from '../assets/images/newspapers/wsj-cover.jpg';
import ag_cover from '../assets/images/magazines/ag-cover.jpg';

export interface Magazine {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  category: string;
  publishDate: string;
  isFreeTrial: boolean;
}

export const magazines: Magazine[] = [
  {
    id: '1',
    title: 'The Wall Street Journal 2025年1月2日',
    description: '华尔街日报PDF免费下载',
    coverUrl: wsj_cover,
    category: '英文报纸',
    publishDate: '2025-01-02',
    isFreeTrial: true
  },
  {
    id: '2',
    title: 'Australian Geographic January/February 2025',
    description: '澳大利亚地理杂志',
    coverUrl: ag_cover,
    category: '人文地理',
    publishDate: '2025-01-02',
    isFreeTrial: true
  }
];

export const categories = [
  '英文报纸',
  '人文地理',
  '商业财经',
  '娱乐时尚',
  '电子书资源'
]; 