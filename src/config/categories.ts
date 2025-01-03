export interface Category {
  key: string;
  value: string;
  label: string;
  labelEn: string;
  path: string;
}

export interface CategoryOption {
  value: string;
  label: string;
}

export const categories: Category[] = [
  {
    key: 'newspapers',
    value: 'newspapers',
    label: '英文报纸',
    labelEn: 'Newspapers',
    path: '/category/newspapers'
  },
  {
    key: 'magazines',
    value: 'magazines',
    label: '人文地理',
    labelEn: 'Geography & Culture',
    path: '/category/magazines'
  },
  {
    key: 'business',
    value: 'business',
    label: '商业财经',
    labelEn: 'Business',
    path: '/category/business'
  },
  {
    key: 'entertainment',
    value: 'entertainment',
    label: '娱乐时尚',
    labelEn: 'Entertainment',
    path: '/category/entertainment'
  },
  {
    key: 'ebooks',
    value: 'ebooks',
    label: '电子书资源',
    labelEn: 'E-Books',
    path: '/category/ebooks'
  }
];

// 获取分类中文标题
export const getCategoryLabel = (key: string): string => {
  const category = categories.find(c => c.key === key);
  return category?.label || key;
};

// 获取分类英文标题
export const getCategoryLabelEn = (key: string): string => {
  const category = categories.find(c => c.key === key);
  return category?.labelEn || key;
};

// 获取所有分类选项（用于Select组件）
export const getCategoryOptions = (): CategoryOption[] => categories.map(c => ({
  value: c.value,
  label: c.label
}));

// 获取导航菜单项
export const getMenuItems = () => [
  { key: '/', label: '首页' },
  ...categories.map(c => ({
    key: c.path,
    label: c.label
  }))
]; 