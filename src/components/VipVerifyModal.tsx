import React, { useState } from 'react';
import { Modal, Input, message, Button } from 'antd';
import { api } from '../services/api';

interface VipVerifyModalProps {
  visible: boolean;
  onClose: () => void;
  onVerifySuccess: () => void;
}

const VipVerifyModal: React.FC<VipVerifyModalProps> = ({ visible, onClose, onVerifySuccess }) => {
  const [vipKey, setVipKey] = useState('');

  const handleVerify = async () => {
    try {
      const result = await api.verifyVipKey(vipKey);
      if (result.valid) {
        localStorage.setItem('vipKey', vipKey);
        message.success('VIP验证成功');
        onVerifySuccess();
        onClose();
      } else {
        message.error('VIP密钥无效');
      }
    } catch (error) {
      message.error('验证失败，请稍后重试');
    }
  };

  return (
    <Modal
      title="VIP验证"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="verify" type="primary" onClick={handleVerify}>
          验证
        </Button>
      ]}
    >
      <div style={{ textAlign: 'center' }}>
        <p>此资源仅限VIP会员下载</p>
        <Input.Password
          placeholder="请输入VIP密钥"
          value={vipKey}
          onChange={e => setVipKey(e.target.value)}
          style={{ marginTop: 16 }}
        />
        <p style={{ marginTop: 16, fontSize: '12px', color: '#999' }}>
          如需获取VIP密钥，请扫描下方二维码联系客服
        </p>
        <img 
          src="/qrcode.jpg" 
          alt="客服二维码" 
          style={{ 
            maxWidth: '100%', 
            width: 200,
            marginTop: 16 
          }} 
        />
      </div>
    </Modal>
  );
};

export default VipVerifyModal; 