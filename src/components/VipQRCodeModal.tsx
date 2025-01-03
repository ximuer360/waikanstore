import React from 'react';
import { Modal } from 'antd';

interface VipQRCodeModalProps {
  visible: boolean;
  onClose: () => void;
}

const VipQRCodeModal: React.FC<VipQRCodeModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      title="升级VIP"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div style={{ textAlign: 'center' }}>
        <img 
          src="/qrcode.jpg" 
          alt="VIP二维码" 
          style={{ 
            maxWidth: '100%', 
            width: 200 
          }} 
        />
        <p style={{ marginTop: 16 }}>扫描二维码，升级VIP会员</p>
      </div>
    </Modal>
  );
};

export default VipQRCodeModal; 