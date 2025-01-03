import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const ADMIN_PASSWORD = 'admin123'
const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: { password: string }) => {
    const envKey = process.env.REACT_APP_ADMIN_KEY;
    console.log('Login attempt:', { 
      entered: values.password, 
      expected: envKey 
    });

    if (values.password === envKey) {
      localStorage.setItem('adminKey', values.password);
      localStorage.setItem('adminLoginTime', Date.now().toString());
      message.success('登录成功');
      navigate('/admin');
    } else {
      message.error('密码错误');
    }
  };

  // 检查是否已登录
  React.useEffect(() => {
    const adminKey = localStorage.getItem('adminKey');
    const envKey = process.env.REACT_APP_ADMIN_KEY;
    
    if (adminKey === envKey) {
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#f0f2f5' 
    }}>
      <Card title="管理员登录" style={{ width: 300 }}>
        <Form
          name="login"
          onFinish={onFinish}
        >
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入管理员密码' }]}
          >
            <Input.Password placeholder="请输入管理员密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage; 