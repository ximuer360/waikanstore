export interface Magazine {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  category: string;
  publishDate: string;
  isFreeTrial: number;
  downloadUrl?: string;
  isVip: number;
  createdAt: string;
} 