import { api } from '../services/api';

export const isVipUser = async () => {
  const vipKey = localStorage.getItem('vipKey');
  if (!vipKey) return false;

  try {
    // 每次都向服务器验证密钥是否有效
    const result = await api.verifyVipKey(vipKey);
    if (!result.valid) {
      clearVipStatus();
      return false;
    }
    return true;
  } catch (error) {
    console.error('VIP验证错误:', error);
    return false;
  }
};

export const clearVipStatus = () => {
  localStorage.removeItem('vipKey');
}; 